import React from 'react';

import { PrimaryButton } from '@entur/button';
import { Heading2 } from '@entur/typography';

import { useConsent } from '@providers/ConsentProvider';
import { saveAllConsents } from 'src/utils/cmpUtils';
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

  // Scroll to the banner when it opens: the page may already be scrolled past it.
  // Waits one frame, because adding the banner shifts the page down first.
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

  // Move focus only when the reader asked for the banner, never on page load.
  // Focus the section, not the heading, so screen readers read out its name.
  React.useEffect(() => {
    if (!isBannerOpen || !isBannerFocusRequested) return;
    sectionRef.current?.focus({ preventScroll: true });
    clearBannerFocusRequest();
  }, [isBannerOpen, isBannerFocusRequested, clearBannerFocusRequest]);

  if (!isBannerOpen || !bannerLabels) return null;

  const { firstLayer, buttons } = bannerLabels;

  // Usercentrics stores the choice, unblocks the scripts it covers and logs the consent.
  // Close the banner only once that succeeds, so a failed choice never looks recorded — the
  // question stands, and stays on screen to be answered again.
  const answer = async (accepted: boolean) => {
    const saved = await saveAllConsents(accepted);
    if (saved) closeBanner();
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
          {firstLayer.title}
        </Heading2>
        {firstLayer.description.default && (
          <div
            className="consent-banner__description"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: sanitizeUcHtml(firstLayer.description.default),
            }}
          />
        )}
        {/* Accepting and declining must look equally weighted for the consent to be
            valid, so both are primary buttons. */}
        <div className="consent-banner__actions">
          <PrimaryButton onClick={() => answer(true)}>
            {buttons.acceptAll}
          </PrimaryButton>
          <PrimaryButton onClick={() => answer(false)}>
            {buttons.denyAll}
          </PrimaryButton>
        </div>
        {/* The note about what cannot be turned off belongs after the choice, so it never
            reads as one of the options. "Short Banner Message for Web" in the admin. */}
        {firstLayer.description.shortDesktop && (
          <div
            className="consent-banner__necessary"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: sanitizeUcHtml(firstLayer.description.shortDesktop),
            }}
          />
        )}
      </div>
    </section>
  );
};

export default ConsentBanner;
