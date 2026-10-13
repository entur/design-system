import React from 'react';
import { BannerAlertBox, Link } from '@entur/linje';

const Stack = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-default)',
    }}
  >
    {children}
  </div>
);

export const Information = () => (
  <BannerAlertBox variant="information" title="Endrede rutetider i sommer">
    Fra 22. juni kjører toget mellom Oslo S og Lillehammer etter sommerruten.
    Sjekk avgangene før du reiser.
  </BannerAlertBox>
);

export const Variants = () => (
  <Stack>
    <BannerAlertBox variant="success" title="Billetten er kjøpt">
      Kvitteringen er sendt til e-postadressen din.
    </BannerAlertBox>
    <BannerAlertBox variant="warning" title="Forsinkelser på Bergensbanen">
      Det er ventet forsinkelser på opptil 30 minutter mellom Voss og Myrdal.
    </BannerAlertBox>
    <BannerAlertBox variant="negative" title="Betalingen feilet">
      Vi klarte ikke å belaste kortet ditt. Prøv igjen eller velg en annen
      betalingsmåte.
    </BannerAlertBox>
  </Stack>
);

export const Closable = () => (
  <BannerAlertBox
    variant="information"
    title="Ny reiseplanlegger"
    closable
    closeButtonLabel="Lukk melding"
    onClose={() => undefined}
  >
    Prøv den nye reiseplanleggeren vår.{' '}
    <Link href="#">Les mer om endringene</Link>.
  </BannerAlertBox>
);

export const WithoutTitle = () => (
  <BannerAlertBox variant="warning">
    Stoppestedet Jernbanetorget er midlertidig flyttet 50 meter østover på grunn
    av veiarbeid.
  </BannerAlertBox>
);
