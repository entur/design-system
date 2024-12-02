import { fontSizes, lineHeights, shadows, space } from '@entur/tokens';
import { useEffect, useState } from 'react';
import { ConsentDetails } from './types/UserCentricsTypes';

export const CMP_INITIALIZE_EVENT = 'UC_UI_INITIALIZED';
export const CONSENT_UPDATED_EVENT = 'UC_CONSENT';

const CMP_SHADOW_ROOT_ID = '#usercentrics-cmp-ui';

declare global {
  interface Window {
    __ucCmp: {
      acceptAllConsents: () => Promise<void>;
      changeLanguage: (language: string) => Promise<void>;
      denyAllConsents: () => Promise<void>;
      updateServicesConsents: (serviceConsents: {
        id: string;
        consent: boolean;
      }) => Promise<void>;
      closeCmp: () => Promise<void>;
      showFirstLayer: () => Promise<void>;
    };
  }
}

type Consents =
  | {
      id: string;
      name: string;
      consentGiven: boolean;
      category: string;
    }[]
  | undefined;

async function initializeCmp() {
  const cmpElement = (await waitForElement(
    CMP_SHADOW_ROOT_ID,
  )) as HTMLElement | null;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(cmpStyleSheet);
  cmpElement?.shadowRoot?.adoptedStyleSheets.push(sheet);
}

function useConsent({
  onConsentUpdate,
}: {
  onConsentUpdate?: (consent: ConsentDetails | undefined) => void;
}) {
  const [consents, setConsents] = useState<Consents>(undefined);
  function handleConsentEvent(event: Event & { detail?: ConsentDetails }) {
    const UC_Event_detail = event.detail;
    const _consents = Object.entries(UC_Event_detail?.services ?? {}).map(
      service => {
        return {
          id: service[0],
          name: service[1].name,
          consentGiven: service[1].consent?.given ?? false,
          category: service[1].category,
        };
      },
    );
    setConsents(_consents);
    onConsentUpdate?.(UC_Event_detail);
  }
  useEffect(() => {
    window.addEventListener(CONSENT_UPDATED_EVENT, handleConsentEvent);
    return () =>
      window.removeEventListener(CONSENT_UPDATED_EVENT, handleConsentEvent);
  }, []);

  return { consents };
}

const acceptAllConsents = runWithRetry('acceptAllConsents');
const denyAllConsents = runWithRetry('denyAllConsents');
const updateServicesConsents = runWithRetry('updateServicesConsents');
const changeLanguage = runWithRetry('changeLanguage');
const showCookieBanner = runWithRetry('showFirstLayer');
const hideCookieBanner = runWithRetry('closeCmp');

export const cookieBanner = {
  acceptAllConsents,
  denyAllConsents,
  updateServicesConsents,
  changeLanguage,
  showCookieBanner,
  hideCookieBanner,
  useConsent,
};

initializeCmp();

/** UTILS */

// Returns document element when it is available in the DOM
async function waitForElement(selector: string) {
  const sleep = (timeout: number) =>
    new Promise(resolve => setTimeout(resolve, timeout));

  return new Promise(async resolve => {
    if (typeof window === undefined) return undefined;

    for (let index = 0; index < 10; index++) {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else {
        await sleep(250);
      }
      throw new Error(
        'Timeout: Could not get element with selector ' + selector,
      );
    }
  });
}

function runWithRetry<T extends keyof typeof window['__ucCmp']>(
  functionName: T,
) {
  type Fn = typeof window['__ucCmp'][T];

  const sleep = (timeout: number) =>
    new Promise(resolve => setTimeout(resolve, timeout));

  return <Fn>(async (...args: Parameters<Fn>) => {
    for (let index = 0; index < 10; index++) {
      if ('__ucCmp' in window) {
        // @ts-expect-error this internal section does not know which args are given
        return (window.__ucCmp[functionName] as Fn)(...args);
        // return fn(...args);
        // const fn: Fn = window.__ucCmp[functionName];
        // // @ts-expect-error this internal section does not know which args are given
        // return fn(...args);
      } else {
        await sleep(250);
      }
    }
    throw new Error('Could not access usercentrics in window object');
  });
}

const cmpStyleSheet = `
  .cmp-wrapper.cmp-wrapper.cmp-wrapper { 
    width: 100%;

    .cmp:not(.second) {
      padding: ${space.rem.large}rem calc((100dvw - 54rem) / 2);
      border-radius: unset;
      box-shadow: ${shadows.cardShadow};

      .language-selector-menu {
        right: calc((100dvw - 64rem) / 2);
      }
    } 

    .privacy-title {
      font-size: ${fontSizes.rem.extraLarge2}rem;
    }
    .privacy-text {
      font-size: ${fontSizes.rem.large}rem;
      line-height: ${lineHeights.rem.large}rem;
    }


    .buttons-row {
      justify-content: flex-end;
    }

    button[data-action="consent"] {
      flex-grow: unset;
      flex-basis: unset;
      width: fit-content;
      min-width: 9.5rem;
      height: 3rem;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 500;
      
      &[data-action-type="accept"] {
        background-color: var(--components-button-primary-contrast-default);
        color: var(--components-button-primary-contrast-text);

        &:hover {
          background-color: var(--components-button-primary-contrast-hover);
        }
      }
      
      &[data-action-type="more"],
      &[data-action-type="deny"] {
        background-color: transparent;
        color: var(--components-button-secondary-contrast-text);
        border: 2px solid var(--components-button-secondary-contrast-border);

        &:hover {
          background-color: var(--components-button-secondary-contrast-hover);
        }
      }
    }

    .poweredBy {
      display: none;
    }
  }
`;
