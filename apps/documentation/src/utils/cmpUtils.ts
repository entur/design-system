declare global {
  interface Window {
    __ucCmp: {
      getConsentDetails: () => Promise<ConsentDetails>;
      acceptAllConsents: () => Promise<void>;
      changeLanguage: (language: string) => Promise<void>;
      getActiveLanguage: () => Promise<string>;
      denyAllConsents: () => Promise<void>;
      updateServicesConsents: (serviceConsents: {
        id: string;
        consent: boolean;
      }) => Promise<void>;
      closeCmp: () => Promise<void>;
      showFirstLayer: () => Promise<void>;
      getControllerId: () => Promise<string>;
    };
    UC_UI: {
      isInitialized: () => boolean;
    };
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
interface ConsentData {
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
  essential?: boolean;
  state: 'ALL_DENIED' | 'SOME_ACCEPTED' | 'ALL_ACCEPTED';
  dps: Record<string, boolean> | null;
  hidden?: boolean;
}

export const CMP_INITIALIZE_EVENT = 'UC_UI_INITIALIZED';
export const CONSENT_UPDATED_EVENT = 'UC_CONSENT';
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
  await waitFor(() => window.__ucCmp !== undefined);
  return window.__ucCmp;
}

export async function getPostHog() {
  if (typeof window === 'undefined') return null;
  await waitFor(() => window.posthog !== undefined);
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

export function waitFor(conditionFunction: () => boolean, interval = 100) {
  return new Promise(resolve => {
    const check = () => {
      if (conditionFunction()) {
        resolve(true);
      } else {
        setTimeout(check, interval);
      }
    };
    check();
  });
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
    await waitFor(() => window.posthog !== undefined);
    window.posthog?.identify(event.detail?.consent.controllerId);
    window.posthog?.opt_in_capturing();
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
