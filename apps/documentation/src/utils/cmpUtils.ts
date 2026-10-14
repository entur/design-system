import type Usercentrics from '@usercentrics/cmp-browser-sdk';
import type {
  Category,
  DefaultLabels,
  Service,
  UserDecision,
} from '@usercentrics/cmp-browser-sdk';

declare global {
  interface Window {
    posthog: {
      identify: (distinctId?: string) => void;
      capture: (event: string, properties?: Record<string, any>) => void;
      opt_in_capturing: () => void;
    };
  }
}

export const UC_SETTINGS_ID = '6QfyMRB25Z5CMz';

export type { Category, Service, UserDecision };

/** The texts authored in the Usercentrics admin, for the banner and the privacy page. */
export type UcLabels = DefaultLabels;

let cmpRequest: Promise<Usercentrics | null> | null = null;

/** Starts Usercentrics and hands back the SDK. It reaches for `window` as it loads, so it
 *  is imported lazily here, only ever evaluating in the browser and never during SSR.
 *  Resolves null when Usercentrics cannot be reached — usually an ad blocker. */
export async function getCMP(): Promise<Usercentrics | null> {
  if (typeof window === 'undefined') return null;
  // Hold on to the request so only one SDK instance ever starts, but not to a failure: a
  // connection that drops for a moment should not rule out Usercentrics for the visit.
  if (!cmpRequest) {
    cmpRequest = (async () => {
      try {
        const { default: UsercentricsSdk } = await import(
          '@usercentrics/cmp-browser-sdk'
        );
        const cmp = new UsercentricsSdk(UC_SETTINGS_ID);
        await cmp.init();
        return cmp;
      } catch {
        cmpRequest = null;
        return null;
      }
    })();
  }
  // A blocked request can leave the SDK waiting rather than failing, and the banner would
  // then never resolve either way. Give up on it after the timeout instead.
  return Promise.race([
    cmpRequest,
    new Promise<null>(resolve => setTimeout(() => resolve(null), 10_000)),
  ]);
}

export async function getPostHog() {
  if (typeof window === 'undefined') return null;
  const ready = await waitFor(() => window.posthog !== undefined);
  if (!ready) return null;
  return window.posthog;
}

/** Polls until the condition holds. Resolves false when the timeout is reached, so a
 *  blocked script doesn't leave us polling for the lifetime of the page. */
function waitFor(
  conditionFunction: () => boolean,
  interval = 100,
  timeout = 10_000,
): Promise<boolean> {
  return new Promise(resolve => {
    const deadline = Date.now() + timeout;
    const check = () => {
      if (conditionFunction()) resolve(true);
      else if (Date.now() >= deadline) resolve(false);
      else setTimeout(check, interval);
    };
    check();
  });
}

/** Reads the texts Usercentrics serves for our settings, so both the banner and the privacy
 *  page render what is authored in the Usercentrics admin instead of copy kept in code. The
 *  fields we depend on are validated, since an empty text would leave the banner blank. */
export async function fetchUcLabels(): Promise<UcLabels | null> {
  const cmp = await getCMP();
  if (!cmp) return null;
  const labels = cmp.getSettingsLabels() as UcLabels;
  if (
    !labels?.firstLayer?.title ||
    !labels?.buttons?.acceptAll ||
    !labels?.buttons?.denyAll
  ) {
    return null;
  }
  return labels;
}

/** Writes consent for whole categories. Usercentrics works per service, so each category is
 *  written as a decision for every service in it. It keeps ownership of storing the choice,
 *  unblocking scripts and logging the consent record. */
export async function saveCategoryConsents(
  categoryConsents: Record<string, boolean>,
) {
  const cmp = await getCMP();
  if (!cmp) return false;
  try {
    const categories = await cmp.getCategoriesFullInfo();
    const decisions: UserDecision[] = categories
      .filter(category => category.slug in categoryConsents)
      .flatMap(category =>
        category.services.map(service => ({
          serviceId: service.id,
          status: categoryConsents[category.slug],
        })),
      );
    await cmp.updateServices(decisions);
    await afterConsentChange(cmp);
    return true;
  } catch {
    // Callers show the choice as unavailable rather than as saved.
    return false;
  }
}

/** Accepts or denies everything optional, and persists it. */
export async function saveAllConsents(accepted: boolean) {
  const cmp = await getCMP();
  if (!cmp) return false;
  try {
    if (accepted) await cmp.acceptAllServices();
    else await cmp.denyAllServices();
    await afterConsentChange(cmp);
    return true;
  } catch {
    return false;
  }
}

const POSTHOG_SERVICE_NAME = 'PostHog.com';

/** Whether the visitor has said yes to the service that carries our analytics. */
function hasAnalyticsConsent(cmp: Usercentrics): boolean {
  return (
    cmp
      .getServicesBaseInfo()
      .find(service => service.name === POSTHOG_SERVICE_NAME)?.consent.status ??
    false
  );
}

/** Whether analytics was running when the page was loaded. Withdrawing consent has to
 *  reload the page, and only a change from yes to no calls for that. */
let hadAnalyticsConsent: boolean | null = null;

/** Run once the SDK is up, so a consent restored from an earlier visit starts PostHog, and
 *  after every consent change. Usercentrics unblocks the scripts and logs the consent
 *  itself; this is the part that is ours — starting PostHog when it is allowed, and getting
 *  rid of it when it no longer is.
 *
 *  Usercentrics only dispatches window events for names set up as custom window events in
 *  the admin, and ours has none, so this is called straight from the places that change the
 *  consent rather than from an event listener. */
export async function afterConsentChange(cmp: Usercentrics) {
  if (typeof window === 'undefined') return;

  const consentGiven = hasAnalyticsConsent(cmp);

  // Reloading is the most thorough way to stop PostHog: it cannot be unloaded, and after a
  // fresh load Usercentrics blocks the script again, so nothing is recorded.
  if (hadAnalyticsConsent === true && !consentGiven) {
    location.reload();
    return;
  }

  hadAnalyticsConsent = consentGiven;

  if (consentGiven) {
    // Scripts blocked at page load are unblocked by Usercentrics, so PostHog only appears
    // after this point.
    const posthog = await getPostHog();
    posthog?.identify(cmp.getControllerId());
    posthog?.opt_in_capturing();
  }
}
