import React from 'react';
import { ConsentDetails } from './types/UserCentricsTypes';
import { fontSizes, lineHeights, shadows, space } from '@entur/tokens';

const CONSENT_EVENT = 'UC_CONSENT';
const INITIALIZE_EVENT = 'UC_UI_INITIALIZED';

declare global {
  interface Window {
    __ucCmp: any;
  }
}

type ConsentContextType = {
  consents:
    | {
        id: string;
        name: string;
        consentGiven: boolean;
        category: string;
      }[]
    | undefined;
  isInitialized: boolean;
  acceptAllConsents: (() => Promise<void>) | undefined;
  denyAllConsents: (() => Promise<void>) | undefined;
  updateServicesConsents:
    | ((
        serviceConsents: Array<{ id: string; consent: boolean }>,
      ) => Promise<void>)
    | undefined;
  changeLanguage: ((language: string) => Promise<void>) | undefined;
};
const ConsentContext = React.createContext<ConsentContextType>({
  consents: undefined,
  isInitialized: false,
  acceptAllConsents: undefined,
  denyAllConsents: undefined,
  updateServicesConsents: undefined,
  changeLanguage: undefined,
});

export const ConsentProvider = ({
  language,
  ...rest
}: {
  language: 'en' | 'nb' | 'nn';
}) => {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [consents, setConsents] =
    React.useState<ConsentContextType['consents']>(undefined);

  async function acceptAllFunction() {
    // if (window?.__ucCmp === undefined)
    await window?.__ucCmp?.acceptAllConsentsFunction();
  }
  const denyAllFunction = () => {};
  const updateServicesConsentsFunction = () => {};
  const changeLanguageFunction = () => {};

  React.useEffect(() => {
    function logConsent(event: Event & { detail?: ConsentDetails }) {
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
    }
    window.addEventListener(CONSENT_EVENT, logConsent);
    return () => {
      window.removeEventListener(CONSENT_EVENT, logConsent);
    };
  }, []);

  React.useEffect(() => {
    function updatelanguage() {
      if (window?.__ucCmp === undefined)
        console.warn(
          'Could not find __ucCmp within window object, have you initialized the UserCentrics CMP v3 script?',
        );
      window?.__ucCmp?.changeLanguage(language);
    }
    function initializeCMPSettings() {
      updatelanguage();
      console.log('window', window?.__ucCmp);
      console.log('window accept', window?.__ucCmp?.acceptAllConsents);
      // setDenyAllFunction(window.__ucCmp.denyAllConsents as () => Promise<void>);
      // setUpdateServicesConsentsFunction(
      //   async (servicesConsents: Array<{ id: string; consent: boolean }>) => {
      //     await window.__ucCmp.updateServicesConsents(servicesConsents);
      //     (await window.__ucCmp.saveConsents()) as (servicesConsents: {
      //       id: string;
      //       consent: boolean;
      //     }) => Promise<void>;
      //   },
      // );
      // setChangeLanguageFunction(
      //   window?.__ucCmp?.changeLanguage as (language: string) => Promise<void>,
      // );

      setIsInitialized(true);
    }

    isInitialized && updatelanguage();

    window.addEventListener(INITIALIZE_EVENT, initializeCMPSettings);
    return () => {
      window.removeEventListener(INITIALIZE_EVENT, initializeCMPSettings);
    };
  }, [language]);

  React.useEffect(() => {
    async function addCustomStylesheet() {
      const cmpElement = (await waitForElement(
        '#usercentrics-cmp-ui',
      )) as HTMLElement | null;
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cmpStyleSheet);
      cmpElement?.shadowRoot?.adoptedStyleSheets.push(sheet);
    }
    addCustomStylesheet();
  }, []);

  const contextValue = React.useMemo(
    () => ({
      consents,
      isInitialized,
      acceptAllConsents: acceptAllFunction,
      denyAllConsents: denyAllFunction,
      updateServicesConsents: updateServicesConsentsFunction,
      changeLanguage: changeLanguageFunction,
    }),
    [
      consents,
      isInitialized,
      // acceptAllFunction,
      // denyAllFunction,
      // updateServicesConsentsFunction,
      // changeLanguageFunction,
    ],
  );

  // @ts-expect-error test
  return <ConsentContext.Provider value={contextValue} {...rest} />;
};

export const useConsent: () => ConsentContextType = () => {
  const context = React.useContext(ConsentContext);
  if (!context) {
    throw new Error(
      'You need to wrap your component in a SettingsProvider component in ' +
        'order to use the useSettings hook',
    );
  }
  return context;
};

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

// Returns document element when it is available in the DOM
function waitForElement(selector: string) {
  return new Promise(resolve => {
    const observer = new MutationObserver((_, observer) => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
