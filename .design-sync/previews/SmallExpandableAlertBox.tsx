import React from 'react';
import { SmallExpandableAlertBox } from '@entur/linje';

// No open/defaultOpen prop: the expanded cell clicks the toggle once after mount.
const OpenOnMount = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    ref.current
      ?.querySelector<HTMLButtonElement>('.eds-expandable-alert-box__button')
      ?.click();
  }, []);
  return <div ref={ref}>{children}</div>;
};

export const Closed = () => (
  <SmallExpandableAlertBox variant="information" title="Bytte underveis">
    Denne reisen har ett bytte på Lillestrøm. Du har 8 minutter på deg til å
    rekke neste tog fra spor 2.
  </SmallExpandableAlertBox>
);

export const Open = () => (
  <OpenOnMount>
    <SmallExpandableAlertBox variant="information" title="Bytte underveis">
      Denne reisen har ett bytte på Lillestrøm. Du har 8 minutter på deg til å
      rekke neste tog fra spor 2.
    </SmallExpandableAlertBox>
  </OpenOnMount>
);

export const Variants = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-default)',
    }}
  >
    <SmallExpandableAlertBox variant="warning" title="Begrenset kapasitet">
      Toget har færre vogner enn vanlig. Vi anbefaler å reservere sete.
    </SmallExpandableAlertBox>
    <SmallExpandableAlertBox variant="negative" title="Ugyldig rabattkode">
      Rabattkoden gjelder bare for reiser med Vy i Viken.
    </SmallExpandableAlertBox>
  </div>
);

export const Closable = () => (
  <SmallExpandableAlertBox
    variant="success"
    title="Setet er reservert"
    openLabel="Vis sete"
    closeLabel="Skjul sete"
    closable
    closeButtonLabel="Lukk melding"
    onClose={() => undefined}
  >
    Vogn 3, sete 42 (vindu).
  </SmallExpandableAlertBox>
);
