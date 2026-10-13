import React from 'react';
import { SkipToContent } from '@entur/linje';

// The link is position:fixed and translated off-screen until focused. A transformed
// wrapper becomes its containing block, so it stays inside the card.
const Page = ({
  focused,
  children,
}: {
  focused?: boolean;
  children: React.ReactNode;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (focused) ref.current?.querySelector('a')?.focus();
  }, [focused]);
  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        transform: 'translateZ(0)',
        overflow: 'hidden',
        width: 420,
        border: '1px solid var(--basecolors-stroke-subdued, #d7d7e0)',
        borderRadius: 4,
        background: 'var(--basecolors-frame-default, #fff)',
      }}
    >
      {children}
      <div
        style={{
          padding: 'var(--space-default, 1rem)',
          paddingTop: '4rem',
          display: 'grid',
          gap: 'var(--space-small, 0.5rem)',
        }}
      >
        <strong>Entur – Reiseplanlegger</strong>
        <div id="hovedinnhold">Finn avganger fra ditt stoppested</div>
      </div>
    </div>
  );
};

export const Focused = () => (
  <Page focused>
    <SkipToContent mainId="hovedinnhold">Hopp til hovedinnhold</SkipToContent>
  </Page>
);

export const HiddenUntilFocus = () => (
  <Page>
    <SkipToContent mainId="hovedinnhold">Hopp til hovedinnhold</SkipToContent>
  </Page>
);
