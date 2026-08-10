import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { usePersistedState } from './SettingsContext';
import {
  CMP_VIEW_CHANGED_EVENT,
  CONSENT_UPDATED_EVENT,
  CmpView,
  Consents,
  UcFirstLayerLabels,
  fetchUcLabels,
  getCMP,
  handleConsentUpdate,
} from 'src/utils/cmpUtils';

export type ConsentValue = 'undecided' | 'accepted' | 'denied' | undefined;

export type ConsentSet = {
  [key: string]: ConsentValue;
};

type ConsentProviderProps = {
  initialConsents?: ConsentSet | null;
  children: React.ReactNode;
};

type ConsentContextType = {
  consents: ConsentSet | null;
  updateConsents: (updatedValues: ConsentSet) => void;
  /** Texts for the consent banner, as authored in the Usercentrics admin */
  bannerLabels: UcFirstLayerLabels | null;
  isBannerOpen: boolean;
  /** True when the banner was opened by the user, and should be brought into view */
  isBannerFocusRequested: boolean;
  /** False once we know Usercentrics cannot be reached, so entry points that would open
   *  the banner can step aside instead of leading nowhere. The privacy page explains the
   *  situation and what is stored regardless. */
  canOpenBanner: boolean;
  openBanner: () => void;
  closeBanner: () => void;
  clearBannerFocusRequest: () => void;
};

const ConsentContext = React.createContext<ConsentContextType | null>(null);

export const ConsentProvider = ({
  initialConsents = null,
  children,
}: ConsentProviderProps) => {
  const [consents, setConsents] = usePersistedState(
    'consents',
    initialConsents,
  );
  const [bannerLabels, setBannerLabels] =
    React.useState<UcFirstLayerLabels | null>(null);
  const [isBannerOpen, setBannerOpen] = React.useState(false);
  const [isBannerFocusRequested, setBannerFocusRequested] =
    React.useState(false);
  // Assume it works until proven otherwise, so the entry points don't flicker away on a
  // slow connection.
  const [canOpenBanner, setCanOpenBanner] = React.useState(true);
  const labelsRequest = useRef<Promise<UcFirstLayerLabels | null> | null>(null);

  const updateConsents = (updatedValues: ConsentSet) => {
    setConsents({ ...consents, ...updatedValues });
  };

  const loadBannerLabels = useCallback(async () => {
    if (!labelsRequest.current) {
      labelsRequest.current = (async () => {
        const cmp = await getCMP();
        const consentDetails = await cmp?.getConsentDetails();
        if (!consentDetails) return null;
        const bundle = await fetchUcLabels(consentDetails.consent);
        return bundle?.firstLayer ?? null;
      })();
    }
    const labels = await labelsRequest.current;
    // Hold on to the request so it only runs once, but not to a failure: a connection that
    // drops for a moment should not rule out the texts for the rest of the visit.
    if (labels) setBannerLabels(labels);
    else labelsRequest.current = null;
    return labels;
  }, []);

  const closeBanner = useCallback(() => {
    setBannerOpen(false);
    setBannerFocusRequested(false);
  }, []);

  const clearBannerFocusRequest = useCallback(
    () => setBannerFocusRequested(false),
    [],
  );

  // Without texts from Usercentrics there is nothing to show, so the banner only opens
  // once they have loaded. Opening is always a deliberate action here — the entry points
  // sit in the footer and the settings panel, far from the banner — so ask for it to be
  // brought into view.
  const openBanner = useCallback(async () => {
    const labels = await loadBannerLabels();
    if (!labels) {
      setCanOpenBanner(false);
      return;
    }
    setBannerOpen(true);
    setBannerFocusRequested(true);
  }, [loadBannerLabels]);

  // Usercentrics decides whether consent is still needed — it accounts for first visits,
  // expiry and renewed consent settings.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cmp = await getCMP();
      const consentDetails = await cmp?.getConsentDetails();
      if (cancelled) return;
      if (!consentDetails) {
        // Usually an ad blocker stopping the loader.
        setCanOpenBanner(false);
        return;
      }
      if (!consentDetails.consent.required) return;
      const labels = await loadBannerLabels();
      if (cancelled) return;
      if (labels) setBannerOpen(true);
      else setCanOpenBanner(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [loadBannerLabels]);

  // Event listener for handling changes to and from Usercentrics CMP
  useEffect(() => {
    let previousConsents: Consents | null = null;

    const consentUpdateHandler = async (event: Event) => {
      setBannerOpen(false);
      previousConsents = await handleConsentUpdate(event, previousConsents);
    };

    window.addEventListener(CONSENT_UPDATED_EVENT, consentUpdateHandler);

    return () => {
      window.removeEventListener(CONSENT_UPDATED_EVENT, consentUpdateHandler);
    };
  }, []);

  // Suppressing the Usercentrics UI only covers its initial render, and it can still ask
  // to show itself later. ConsentBanner and the privacy page cover everything we need, so
  // close it again whenever it tries.
  useEffect(() => {
    const viewChangeHandler = (event: Event) => {
      const view = (event as CustomEvent<{ view?: CmpView }>).detail?.view;
      if (view && view !== 'NONE') window.__ucCmp?.closeCmp();
    };

    window.addEventListener(CMP_VIEW_CHANGED_EVENT, viewChangeHandler);

    return () => {
      window.removeEventListener(CMP_VIEW_CHANGED_EVENT, viewChangeHandler);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      consents,
      updateConsents,
      bannerLabels,
      isBannerOpen,
      isBannerFocusRequested,
      canOpenBanner,
      openBanner,
      closeBanner,
      clearBannerFocusRequest,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      consents,
      bannerLabels,
      isBannerOpen,
      isBannerFocusRequested,
      canOpenBanner,
      openBanner,
      closeBanner,
      clearBannerFocusRequest,
    ],
  );

  return (
    <ConsentContext.Provider value={contextValue}>
      {children}
    </ConsentContext.Provider>
  );
};

export const useConsent = () => {
  const context = React.useContext(ConsentContext);
  if (!context) {
    throw new Error(
      'You need to wrap your component in a ConsentProvider component in ' +
        'order to use the useConsent hook',
    );
  }
  return context;
};
