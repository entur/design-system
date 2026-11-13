export type IllustrationCategory = {
  folder: string;
  label: string;
  description: string;
  wide?: boolean;
};

export const ILLUSTRATION_CATEGORIES: IllustrationCategory[] = [
  {
    folder: 'Landscape',
    label: 'Landskap',
    description:
      'Til landingssider på web. Bør dekke hele sidens bredde. «City» er hovedillustrasjonen og brukes der brukeren møter Entur for første gang.',
    wide: true,
  },
  {
    folder: 'Front page',
    label: 'Forside',
    description: 'Toppillustrasjoner for forsiden, til sommer og vinter.',
    wide: true,
  },
  {
    folder: 'People',
    label: 'Mennesker',
    description: 'Personer på reise, til informasjonssider og meldinger.',
  },
  {
    folder: 'Scenario',
    label: 'Scenarier',
    description:
      'En person fra «Mennesker» satt inn i en by, på en togstasjon eller på toget.',
  },
  {
    folder: 'Entur staff',
    label: 'Entur-ansatte',
    description: 'Ansatte i Entur.',
  },
  {
    folder: 'Animals',
    label: 'Dyr',
    description:
      'Brukes i statusbeskjeder og tomme tilstander. Se Retningslinjer for hvilket dyr som hører til hvilken beskjed.',
  },
  {
    folder: 'Objects',
    label: 'Gjenstander',
    description: 'Ting og handlinger, som billett, varsel og sletting.',
  },
  {
    folder: 'Concepts',
    label: 'Konsepter',
    description: 'Illustrerer tjenester og større sammenhenger.',
  },
  {
    folder: 'Hands',
    label: 'Hender',
    description: 'Tilbakemeldinger som tommel opp og applaus.',
  },
  {
    folder: 'Devices',
    label: 'Digitale enheter',
    description: 'Mobil, nettbrett og skjerm, med og uten innhold.',
  },
  {
    folder: 'Transport',
    label: 'Transportmidler',
    description: 'Tog, buss, trikk, båt og sparkesykkel.',
  },
  {
    folder: 'Travel',
    label: 'Hittegods',
    description: 'Ting man har med seg på reisen.',
  },
  {
    folder: 'Utviklingsprinsipper',
    label: 'Utviklingsprinsipper',
    description: 'Illustrasjoner til Enturs utviklingsprinsipper. Kun PNG.',
  },
];

export const categoryLabel = (folder: string) =>
  ILLUSTRATION_CATEGORIES.find(c => c.folder === folder)?.label ?? folder;
