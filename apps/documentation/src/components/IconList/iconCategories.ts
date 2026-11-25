export type IconCategory = {
  /** Folder in packages/icons/src/svgs, or folder/subfolder */
  folder: string;
  label: string;
  description: string;
  /** White logos, shown on a dark background */
  dark?: boolean;
};

export const ICON_CATEGORIES: IconCategory[] = [
  {
    folder: 'UI',
    label: 'Brukergrensesnitt',
    description: 'Handlinger, status og objekter i grensesnittet.',
  },
  {
    folder: 'Arrows',
    label: 'Piler',
    description: 'Retning, navigasjon og handlinger som flytter innhold.',
  },
  {
    folder: 'Travel',
    label: 'Reise',
    description: 'Billetter, steder og annet som hører til en reise.',
  },
  {
    folder: 'Transport',
    label: 'Transport',
    description:
      'Transportmidler. Ikonene får fargen til transportmiddelet, med mindre du setter color.',
  },
  {
    folder: 'Facilities',
    label: 'Fasiliteter',
    description: 'Tilbud og fasiliteter om bord og på stasjonen.',
  },
  {
    folder: 'Shopping',
    label: 'Handel',
    description: 'Kjøp, priser og penger.',
  },
  {
    folder: 'Payment',
    label: 'Betaling',
    description: 'Betalingsmåter, med merkevarens egne farger.',
  },
  {
    folder: 'Technology',
    label: 'Teknologi',
    description: 'Enheter og teknisk utstyr.',
  },
  {
    folder: 'Text',
    label: 'Tekstformatering',
    description: 'Verktøy for å formatere tekst.',
  },
  { folder: 'Weather', label: 'Vær', description: 'Vær og temperatur.' },
  { folder: 'Flags', label: 'Flagg', description: 'Flagg til språkvalg.' },
  { folder: 'Logo', label: 'Entur-logo', description: 'Enturs logo.' },
  {
    folder: 'Partners',
    label: 'Partnere',
    description: 'Logoer for operatører og partnere. Laget for mørk bakgrunn.',
    dark: true,
  },
  {
    folder: 'Partners/Mobility',
    label: 'Mobilitetspartnere',
    description: 'Logoer for bysykkel, sparkesykkel og bildeling.',
  },
  {
    folder: 'SocialMedia',
    label: 'Sosiale medier',
    description: 'Logoer for sosiale medier.',
  },
  {
    folder: 'ThirdPartyLogo',
    label: 'Tredjepartslogoer',
    description: 'Logoer for apper og verktøy fra andre.',
  },
];

/** The group an icon is shown in: its top folder, except mobility partners */
export const groupOf = (category: string) =>
  ICON_CATEGORIES.some(c => c.folder === category)
    ? category
    : category.split('/')[0];

export const categoryOf = (folder: string) =>
  ICON_CATEGORIES.find(c => c.folder === folder);

export const categoryLabel = (folder: string) =>
  categoryOf(folder)?.label ?? folder;
