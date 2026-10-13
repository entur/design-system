import React from 'react';
import { Drawer, Paragraph, PrimaryButton, Heading2 } from '@entur/linje';

// The component moves focus to its title/dialog on open (a11y behaviour); drop that
// programmatic focus ring after mount so the static preview shows the resting look.
const BlurFocus = () => {
  React.useEffect(() => {
    const t = setTimeout(
      () => (document.activeElement as HTMLElement | null)?.blur?.(),
      150,
    );
    return () => clearTimeout(t);
  }, []);
  return null;
};

// Drawer is position:fixed to the right edge. The transformed frame becomes its
// containing block so it docks inside the card. Needs cardMode "single".
const Frame = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: 'relative',
      height: 560,
      transform: 'translateZ(0)',
      overflow: 'hidden',
    }}
  >
    <div style={{ padding: 'var(--space-large)', maxWidth: 380 }}>
      <Heading2>Mine reiser</Heading2>
      <Paragraph>Oslo S – Bergen, 12. juni kl. 08:12</Paragraph>
      <Paragraph>Bergen – Voss, 14. juni kl. 16:30</Paragraph>
    </div>
    {children}
    <BlurFocus />
  </div>
);

const Content = () => (
  <>
    <Paragraph>
      Reisen har ett bytte på Voss. Billetten gjelder for alle delstrekninger,
      og setereservasjon er inkludert på toget fra Oslo S.
    </Paragraph>
    <Paragraph>
      Endringer kan gjøres frem til 15 minutter før avreise.
    </Paragraph>
    <PrimaryButton type="button">Den er grei</PrimaryButton>
  </>
);

export const Default = () => (
  <Frame>
    <Drawer title="Om reisen" open onDismiss={() => undefined}>
      <Content />
    </Drawer>
  </Frame>
);

export const Contrast = () => (
  <Frame>
    <Drawer title="Om reisen" contrast open onDismiss={() => undefined}>
      <Content />
    </Drawer>
  </Frame>
);
