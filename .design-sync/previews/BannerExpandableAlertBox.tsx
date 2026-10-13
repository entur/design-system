import React from 'react';
import { BannerExpandableAlertBox } from '@entur/linje';

// The component keeps its open state internally (no open/defaultOpen prop),
// so the expanded cell clicks the "Les mer" toggle once after mount.
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
  <BannerExpandableAlertBox
    variant="warning"
    title="Innstilte avganger på Gjøvikbanen"
  >
    På grunn av sporarbeid er alle avganger mellom Oslo S og Jaren innstilt
    lørdag og søndag. Det settes opp buss for tog fra Oslo bussterminal.
  </BannerExpandableAlertBox>
);

export const Open = () => (
  <OpenOnMount>
    <BannerExpandableAlertBox
      variant="warning"
      title="Innstilte avganger på Gjøvikbanen"
    >
      På grunn av sporarbeid er alle avganger mellom Oslo S og Jaren innstilt
      lørdag og søndag. Det settes opp buss for tog fra Oslo bussterminal.
    </BannerExpandableAlertBox>
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
    <BannerExpandableAlertBox
      variant="information"
      title="Nye priser fra 1. februar"
    >
      Enkeltbilletter i sone 1 øker med 2 kroner. Periodebilletter har uendret
      pris.
    </BannerExpandableAlertBox>
    <BannerExpandableAlertBox variant="negative" title="Feil i billettsystemet">
      Det er for tiden ikke mulig å kjøpe billetter i appen. Vi jobber med å
      løse feilen.
    </BannerExpandableAlertBox>
  </div>
);

export const Closable = () => (
  <BannerExpandableAlertBox
    variant="success"
    title="Refusjonen er behandlet"
    closable
    closeButtonLabel="Lukk melding"
    onClose={() => undefined}
    openLabel="Vis detaljer"
    closeLabel="Skjul detaljer"
  >
    Beløpet på 249 kr blir tilbakeført til kortet ditt innen fem virkedager.
  </BannerExpandableAlertBox>
);
