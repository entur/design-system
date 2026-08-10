import React from 'react';

import { PrimaryButton } from '@entur/button';
import { Heading2 } from '@entur/typography';

import { useConsent } from '@providers/ConsentProvider';
import { sanitizeUcHtml } from 'src/utils/sanitizeUcHtml';

import './ConsentBanner.scss';

const TITLE_ID = 'consent-banner-title';

/** Consent banner following the pattern at
 *  https://designsystemet.no/no/patterns/consent-banner: inline at the top of the page,
 *  never a dialog, never blocking, and it never traps focus or takes it on page load.
 *  Usercentrics still records the consent — we only replace its UI. */
export const ConsentBanner = () => {
  const {
    isBannerOpen,
    isBannerFocusRequested,
    bannerLabels,
    closeBanner,
    clearBannerFocusRequest,
  } = useConsent();
  const sectionRef = React.useRef<HTMLElement>(null);

  // The banner is no use unseen, so bring it into view whenever it opens — the browser
  // restores scroll position on load, and inserting the banner above the content shifts
  // the page out from under it. Deferred so the shift has settled first.
  React.useEffect(() => {
    if (!isBannerOpen) return;
    // A hash in the address bar means the reader asked for a particular section, so leave
    // them there rather than dragging the page up to the banner. It stays a scroll away.
    if (!isBannerFocusRequested && window.location.hash) return;
    const frame = requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [isBannerOpen, isBannerFocusRequested]);

  // Taking focus is reserved for when the user asked for the banner. On page load focus
  // has to stay put, so that reading the page is never interrupted. Focusing the section
  // rather than the heading means screen readers announce the banner's name along with it.
  React.useEffect(() => {
    if (!isBannerOpen || !isBannerFocusRequested) return;
    sectionRef.current?.focus({ preventScroll: true });
    clearBannerFocusRequest();
  }, [isBannerOpen, isBannerFocusRequested, clearBannerFocusRequest]);

  if (!isBannerOpen || !bannerLabels) return null;

  const { privacy, buttons } = bannerLabels;

  // acceptAllConsents and denyAllConsents persist the choice themselves. The banner only
  // closes once one of them has gone through, so a choice never looks recorded when it is
  // not. Usercentrics also closes it through UC_CONSENT, which is harmless twice over.
  const answer = async (accepted: boolean) => {
    const cmp = window.__ucCmp;
    if (!cmp) return;
    try {
      if (accepted) await cmp.acceptAllConsents();
      else await cmp.denyAllConsents();
    } catch {
      // The question stands, so leave it on screen to be answered again.
      return;
    }
    closeBanner();
  };

  return (
    <section
      className="consent-banner"
      aria-labelledby={TITLE_ID}
      ref={sectionRef}
      tabIndex={-1}
    >
      <div className="consent-banner__content">
        <Heading2 id={TITLE_ID} className="consent-banner__title" margin="none">
          {privacy.title}
        </Heading2>
        {privacy.description && (
          <div
            className="consent-banner__description"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: sanitizeUcHtml(privacy.description),
            }}
          />
        )}
        {/* Accepting and declining must look equally weighted for the consent to be
            valid, so both are primary buttons. */}
        <div className="consent-banner__actions">
          <PrimaryButton onClick={() => answer(true)}>
            {buttons.accept}
          </PrimaryButton>
          <PrimaryButton onClick={() => answer(false)}>
            {buttons.deny}
          </PrimaryButton>
        </div>
        {/* The note about what cannot be turned off belongs after the choice, so it never
            reads as one of the options. */}
        {privacy.shortDescription && (
          <div
            className="consent-banner__necessary"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: sanitizeUcHtml(privacy.shortDescription),
            }}
          />
        )}
      </div>
    </section>
  );
};

export default ConsentBanner;
