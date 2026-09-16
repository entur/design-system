import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { usePersistedState } from './SettingsContext';
import {
  UcLabels,
  fetchUcLabels,
  getCMP,
  initialiseConsentState,
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
  bannerLabels: UcLabels | null;
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
  const [bannerLabels, setBannerLabels] = React.useState<UcLabels | null>(null);
  const [isBannerOpen, setBannerOpen] = React.useState(false);
  const [isBannerFocusRequested, setBannerFocusRequested] =
    React.useState(false);
  // Assume it works until proven otherwise, so the entry points don't flicker away on a
  // slow connection.
  const [canOpenBanner, setCanOpenBanner] = React.useState(true);
  const labelsRequest = useRef<Promise<UcLabels | null> | null>(null);

  const updateConsents = (updatedValues: ConsentSet) => {
    setConsents({ ...consents, ...updatedValues });
  };

  const loadBannerLabels = useCallback(async () => {
    if (!labelsRequest.current) {
      labelsRequest.current = fetchUcLabels();
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

  // Opens only once the texts have loaded, since there is nothing to show without them.
  // Called from the footer and the settings panel, so the banner is also brought into view.
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
      if (cancelled) return;
      if (!cmp) {
        // Usually an ad blocker stopping the SDK.
        setCanOpenBanner(false);
        return;
      }
      // A consent carried over from an earlier visit starts PostHog here, since nothing
      // else will announce it.
      await initialiseConsentState(cmp);
      if (cancelled) return;
      if (!cmp.getIsConsentRequired()) return;
      const labels = await loadBannerLabels();
      if (cancelled) return;
      if (labels) setBannerOpen(true);
      else setCanOpenBanner(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [loadBannerLabels]);

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
