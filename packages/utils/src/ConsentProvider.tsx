import React from 'react';
import { ConsentDetails } from './types/UserCentricsTypes';
import { fontSizes, lineHeights, shadows, space } from '@entur/tokens';

const CONSENT_EVENT = 'UC_CONSENT';
const INITIALIZE_EVENT = 'UC_UI_INITIALIZED';

const ConsentContext = React.createContext<null>(null);

export const ConsentProvider = ({
  language,
  ...rest
}: {
  language: 'en' | 'nb' | 'nn';
}) => {
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    function logConsent(event: Event & { detail?: ConsentDetails }) {
      const UC_Event_detail = event.detail;
      console.log('UC_CONSENT event detail', UC_Event_detail);
      console.log(
        'UC_CONSENT for Posthog:',
        UC_Event_detail?.services?.['uRoG9JxhEUtI4V'].consent?.given,
      );
    }
    window.addEventListener(CONSENT_EVENT, logConsent);
    return () => {
      window.removeEventListener(CONSENT_EVENT, logConsent);
    };
  }, []);

  React.useEffect(() => {
    function updatelanguage() {
      // @ts-expect-error __ucCmp should exist on window object
      if (window?.__ucCmp === undefined)
        console.warn(
          'Could not find __ucCmp within window object, have you initialized the UserCentrics CMP v3 script?',
        );
      // @ts-expect-error __ucCmp should exist on window object
      window?.__ucCmp?.changeLanguage(language);
    }
    function initializeCMPSettings() {
      setIsInitialized(true);
      updatelanguage();
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

  return <ConsentContext.Provider value={null} {...rest} />;
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
