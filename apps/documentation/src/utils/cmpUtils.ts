declare global {
  interface Window {
    __ucCmp: {
      getConsentDetails: () => Promise<ConsentDetails>;
      isConsentRequired: () => Promise<boolean | undefined>;
      isInitialized: () => Promise<boolean>;
      acceptAllConsents: () => Promise<void>;
      changeLanguage: (language: string) => Promise<void>;
      getActiveLanguage: () => Promise<string>;
      denyAllConsents: () => Promise<void>;
      updateServicesConsents: (
        serviceConsents: { id: string; consent: boolean }[],
      ) => Promise<void>;
      updateCategoriesConsents: (
        categoryConsents: { id: string; consent: boolean }[],
      ) => Promise<void>;
      saveConsents: (type?: ConsentType) => Promise<void>;
      closeCmp: () => Promise<void>;
      showFirstLayer: () => Promise<void>;
      showSecondLayer: (id?: string) => Promise<void>;
      getControllerId: () => Promise<string>;
    };
    /** Set before the Usercentrics loader to keep it from rendering its own UI */
    UC_UI_SUPPRESS_CMP_DISPLAY?: boolean;
    posthog: {
      identify: (distinctId?: string) => void;
      capture: (event: string, properties?: Record<string, any>) => void;
      opt_in_capturing: () => void;
    };
  }
}
export type ConsentActionType =
  | 'onAcceptAllServices'
  | 'onDenyAllServices'
  | 'onEssentialChange'
  | 'onInitialPageLoad'
  | 'onNonEURegion'
  | 'onSessionRestored'
  | 'onTcfStringChange'
  | 'onUpdateServices'
  | 'onMobileSessionRestore';
type SettingType = 'TCF' | 'GDPR' | 'CCPA';
type ConsentType = 'IMPLICIT' | 'EXPLICIT';
export interface ConsentDetails {
  consent: ConsentData;
  services: Record<string, ServiceData>;
  categories: Record<string, CategoryData>;
}
export interface ConsentData {
  status: 'ALL_ACCEPTED' | 'ALL_DENIED' | 'SOME_ACCEPTED' | 'SOME_DENIED';
  serviceIds?: string[];
  required: boolean;
  version: number;
  controllerId: string;
  language: string;
  createdAt: number;
  updatedAt: number;
  updatedBy: ConsentActionType;
  setting: SettingData;
  type: ConsentType;
  hash: string;
  gpcSignal?: boolean;
  isBot?: true;
  isOutsideEu?: true;
}
interface SettingData {
  id: string;
  type: SettingType;
  version: string;
  abVariant?: string;
  sandbox?: true;
}
interface ServiceData {
  name: string;
  version: string;
  category: string;
  essential: boolean;
  consent?: {
    given: boolean;
    type: 'IMPLICIT' | 'EXPLICIT';
  };
  gcm?: {
    analyticsStorage?: true;
    adStorage?: true;
  };
  subservices?: Record<string, ServiceData>;
  thirdCountryDataTransfer?: boolean;
  status?: 'added';
}
interface CategoryData {
  name?: string;
  essential?: boolean;
  state: 'ALL_DENIED' | 'SOME_ACCEPTED' | 'ALL_ACCEPTED';
  dps: Record<string, boolean> | null;
  hidden?: boolean;
}

export const CONSENT_UPDATED_EVENT = 'UC_CONSENT';
/** Dispatched on window the moment window.__ucCmp is assigned. Fires once, no replay. */
export const CMP_API_READY_EVENT = 'UC_CMP_API_READY';
/** Fires whenever Usercentrics switches its own view */
export const CMP_VIEW_CHANGED_EVENT = 'UC_UI_VIEW_CHANGED';

export type CmpView =
  | 'FIRST_LAYER'
  | 'SECOND_LAYER'
  | 'PRIVACY_BUTTON'
  | 'PRIVACY_NOTICE'
  | 'NONE';

export const UC_SETTINGS_ID = '6QfyMRB25Z5CMz';
const UC_API_BASE = 'https://v1.api.service.cmp.usercentrics.eu/latest';

/** Loads the unpublished Usercentrics configuration — its draft texts, theme and injected
 *  CSS — instead of the live one. Set GATSBY_UC_DRAFT=true to preview changes made in the
 *  Usercentrics admin before publishing them. Never enable it for the deployed site. */
export const UC_USE_DRAFT = process.env.GATSBY_UC_DRAFT === 'true';

export type Consents =
  | {
      id: string;
      name: string;
      consentGiven: boolean;
      category: string;
    }[]
  | undefined;

export async function getCMP() {
  if (typeof window === 'undefined') return null;
  const ready = await waitFor(() => window.__ucCmp !== undefined);
  if (!ready) return null;
  return window.__ucCmp;
}

export async function getPostHog() {
  if (typeof window === 'undefined') return null;
  const ready = await waitFor(() => window.posthog !== undefined);
  if (!ready) return null;
  return window.posthog;
}

/** Accepts an event sent by the UC_CONSENT event from Usercentrics CMP
 *  and returns an array of services and their consent status
 */
export function formatConsentEvent(
  event: Event & { detail?: ConsentDetails },
): Consents {
  return Object.entries(event?.detail?.services ?? {}).map(service => {
    return {
      id: service[0],
      name: service[1].name,
      consentGiven: service[1].consent?.given ?? false,
      category: service[1].category,
    };
  });
}

export function formatConsentDetails(consentDetails: ConsentDetails): Consents {
  return Object.entries(consentDetails?.services ?? {}).map(service => {
    return {
      id: service[0],
      name: service[1].name,
      consentGiven: service[1].consent?.given ?? false,
      category: service[1].category,
    };
  });
}

/** Polls until the condition holds. Resolves false when the timeout is reached, so a
 *  blocked Usercentrics loader doesn't leave us polling for the lifetime of the page. */
export function waitFor(
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

export type UcFirstLayerLabels = {
  privacy: {
    title: string;
    description: string;
    /** "Short Banner Message for Web" in the Usercentrics admin. Carries the note about
     *  the necessary information that cannot be turned off. */
    shortDescription?: string;
  };
  buttons: { accept: string; deny: string; more: string; save: string };
};

export type UcCategoryLabels = {
  id: string;
  name: string;
  description?: string;
};

/** One section of a service's detail list. `body` is absent for plain description rows,
 *  a single string for things like the processing company, and a label list for the
 *  purposes, collected data and recipients. */
export type UcServiceDetailSection = {
  id: string;
  title?: string;
  description?: string;
  body?: {
    type: 'text' | 'tag';
    value: string | { id: string; label: string }[];
  };
};

export type UcServiceLabels = {
  id: string;
  name: string;
  description?: string;
  legalBasis?: string[];
  details?: { genericContent?: UcServiceDetailSection[] };
};

export type UcLabelBundle = {
  firstLayer: UcFirstLayerLabels;
  categories: Record<string, UcCategoryLabels>;
  services: Record<string, UcServiceLabels>;
};

/** Reads the texts Usercentrics serves for our settings, so both the banner and the
 *  privacy page render what is authored in the Usercentrics admin instead of copy kept in
 *  code. The endpoint is undocumented, so the fields we depend on are validated. */
export async function fetchUcLabels(
  consent: ConsentData,
): Promise<UcLabelBundle | null> {
  const { type, version } = consent.setting;
  const language = consent.language?.toLowerCase();
  if (!type || !version || !language) return null;

  // Draft versions are only served with the flag set — without it they answer 404.
  const draftQuery = UC_USE_DRAFT ? '?draft=true' : '';

  try {
    const response = await fetch(
      `${UC_API_BASE}/i18n/${language}/${type}/${UC_SETTINGS_ID}/${version}${draftQuery}`,
    );
    if (!response.ok) return null;
    const bundle = await response.json();
    const firstLayer = bundle?.firstLayer;
    if (
      !firstLayer?.privacy?.title ||
      !firstLayer?.buttons?.accept ||
      !firstLayer?.buttons?.deny
    ) {
      return null;
    }
    return {
      firstLayer: firstLayer as UcFirstLayerLabels,
      categories: bundle?.categories ?? {},
      services: bundle?.services ?? {},
    };
  } catch {
    return null;
  }
}

/** Writes consent for whole categories and persists it. Usercentrics keeps ownership of
 *  storing the choice, unblocking scripts and logging the consent record. */
export async function saveCategoryConsents(
  categoryConsents: { id: string; consent: boolean }[],
) {
  const cmp = await getCMP();
  if (!cmp) return false;
  await cmp.updateCategoriesConsents(categoryConsents);
  await cmp.saveConsents();
  return true;
}

export const POSTHOG_SERVICE_NAME = 'PostHog.com';

export async function handleConsentUpdate(
  event: Event & { detail?: ConsentDetails },
  previousConsents: Consents | null,
) {
  if (typeof window === 'undefined') return;

  const consents = formatConsentEvent(event);
  const posthogConsent = consents?.find(c => c.name === POSTHOG_SERVICE_NAME);

  if (posthogConsent?.consentGiven) {
    const posthog = await getPostHog();
    posthog?.identify(event.detail?.consent.controllerId);
    posthog?.opt_in_capturing();
  }

  if (previousConsents !== null) {
    const previousPostHogConsent = previousConsents?.find(
      c => c.name === POSTHOG_SERVICE_NAME,
    );

    const posthogDeclined =
      previousPostHogConsent?.consentGiven === true &&
      posthogConsent?.consentGiven === false;

    if (posthogDeclined) location.reload();
  }

  return consents;
}

export async function getAnalyticsConsent() {
  const cmp = await getCMP();
  if (!cmp) return false;
  const consentDetails = await cmp.getConsentDetails();
  const analyticsConsent = formatConsentDetails(consentDetails)?.find(
    c => c.name === POSTHOG_SERVICE_NAME,
  );
  return analyticsConsent?.consentGiven ?? false;
}

export async function getConsentDetails() {
  const cmp = await getCMP();
  if (!cmp) return undefined;
  const consentDetails = await cmp.getConsentDetails();
  return consentDetails;
}
