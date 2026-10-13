import { ExpandablePanel, Paragraph } from '@entur/linje';

const Body = () => (
  <Paragraph margin="none">
    For de reisende tilbyr Entur en nasjonal reiseplanlegger med oppdaterte
    reiseforslag for alle kollektivreiser i Norge. Løsningen er gratis å bruke
    og konkurransenøytral.
  </Paragraph>
);

export const Closed = () => (
  <div style={{ width: 480, maxWidth: '100%' }}>
    <ExpandablePanel title="Kollektivreisende">
      <Body />
    </ExpandablePanel>
  </div>
);

export const Open = () => (
  <div style={{ width: 480, maxWidth: '100%' }}>
    <ExpandablePanel title="Kollektivreisende" defaultOpen>
      <Body />
    </ExpandablePanel>
  </div>
);

export const Stacked = () => (
  <div
    style={{
      width: 480,
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-small)',
    }}
  >
    <ExpandablePanel title="Om Entur">
      <Paragraph margin="none">
        Entur samler reisedata fra alle kollektivselskap i landet.
      </Paragraph>
    </ExpandablePanel>
    <ExpandablePanel title="Billetter og priser" defaultOpen>
      <Paragraph margin="none">
        Kjøp én billett for hele reisen, også når du bytter mellom tog og buss.
      </Paragraph>
    </ExpandablePanel>
    <ExpandablePanel title="Kundeservice">
      <Paragraph margin="none">
        Kundeservice er åpent alle dager fra 07 til 23.
      </Paragraph>
    </ExpandablePanel>
  </div>
);
