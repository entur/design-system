import { fontSizes, lineHeights, shadows, space } from '@entur/tokens';
import { ConsentDetails } from './types';

export const CMP_INITIALIZE_EVENT = 'UC_UI_INITIALIZED';
export const CONSENT_UPDATED_EVENT = 'UC_CONSENT';
const CMP_SHADOW_ROOT_ID = 'usercentrics-cmp-ui';

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

const acceptAllConsents = () => window.__ucCmp.acceptAllConsents();
const denyAllConsents = () => window.__ucCmp.denyAllConsents();
const updateServicesConsents = (serviceConsents: {
  id: string;
  consent: boolean;
}) => window.__ucCmp.updateServicesConsents(serviceConsents);
const changeLanguage = (language: string) =>
  window.__ucCmp.changeLanguage(language);
const showCookieBanner = () => window.__ucCmp.showFirstLayer();
const hideCookieBanner = () => window.__ucCmp.closeCmp();

async function styleCookieBanner() {
  await waitForElementWithId(CMP_SHADOW_ROOT_ID);
  const cmpElement = document.getElementById(
    CMP_SHADOW_ROOT_ID,
  ) as HTMLElement | null;
  console.log('cmp', cmpElement);
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(cmpStyleSheet);
  cmpElement?.shadowRoot?.adoptedStyleSheets.push(sheet);
}

function formatConsentEvent(
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

export const cookieBanner = {
  acceptAllConsents,
  denyAllConsents,
  updateServicesConsents,
  changeLanguage,
  showCookieBanner,
  hideCookieBanner,
  eventListner: {
    CONSENT_UPDATED_EVENT,
    CMP_INITIALIZE_EVENT,
  },
  formatConsentEvent,
};

if (typeof window !== 'undefined') styleCookieBanner();

/** Utils */

// Returns true when element with id is available in the DOM
export async function waitForElementWithId(selector: string) {
  return new Promise(resolve => {
    const observer = new MutationObserver((_, observer) => {
      const element = document.querySelector('#' + selector);
      if (element) {
        observer.disconnect();
        resolve(true);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

/** Stylesheet for CookieBanner */

export const cmpStyleSheet = `
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
