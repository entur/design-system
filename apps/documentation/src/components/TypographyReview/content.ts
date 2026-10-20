// Short texts for the typography review page. Numbered so we can say "S2" or "B7" in the meeting.

export type Owner = 'Design' | 'Produkt' | 'Design + produkt' | 'Design + kode';

export type Question = {
  id: string;
  title: string;
  context: string;
  proposal: string;
  owner: Owner;
  topic?: string;
};

export const questions: Question[] = [
  {
    id: 'S1',
    title: 'Avstandsmodell i Figma',
    context:
      'Brytere i dag. Alternativ D: auto layout, luften over ligger på overskriften.',
    proposal: 'Alternativ D, likest koden.',
    owner: 'Design',
    topic: 'avstand',
  },
  {
    id: 'S2',
    title: 'Luft etter bilder og komponenter',
    context: 'Ingen regel i Figma. Koden bruker 24 px.',
    proposal: 'Behold 24 px.',
    owner: 'Design',
    topic: 'avstand',
  },
  {
    id: 'S3',
    title: 'Ny lenkestrek og sveip',
    context: 'Tynn strek under teksten, tykk strek sveiper inn på hover.',
    proposal: 'Godkjenn og legg i Figma.',
    owner: 'Design',
    topic: 'lenker',
  },
  {
    id: 'S4',
    title: 'Fjerne ikonet for ekstern lenke',
    context: 'Leses både som «annen side» og «ny fane». 63 bruk i dag.',
    proposal: 'Fjern. Skriv «(åpnes i ny fane)» i teksten.',
    owner: 'Design + produkt',
    topic: 'lenker',
  },
  {
    id: 'S5',
    title: 'Fyll på kodetekst',
    context: 'Blue/20 (lys) · Blue/100 (kontrast) · Ebony/90 (mørk).',
    proposal: 'Se i alle tre moduser.',
    owner: 'Design',
    topic: 'kode',
  },
  {
    id: 'S6',
    title: 'Listemarkører i tekstfarge',
    context: 'Korall har 3,1:1 og stryker på kontrast.',
    proposal: 'Tekstfarge.',
    owner: 'Design',
    topic: 'lister',
  },
  {
    id: 'S7',
    title: 'Steg-liste',
    context: 'Ny variant med tall i merker.',
    proposal: 'Ta den med.',
    owner: 'Design',
    topic: 'lister',
  },
  {
    id: 'S8',
    title: 'Gammel typografi',
    context:
      'Utfase, fjerne eller beholde? ~7 900 bruk. Label, Link, ListItem, UnorderedList og NumberedList finnes i begge (~1 700 bruk).',
    proposal:
      'Utfase uten ny import: unike navn får @deprecated, de fem felles navnene blir de nye. Advarsler når egne komponenter er flyttet, fjernes i en senere major.',
    owner: 'Produkt',
  },
];

export type Decision = { id: string; title: string; why: string };

export const decisions: Decision[] = [
  {
    id: 'B1',
    title: 'Redesign før graduering',
    why: 'Én brytende endring i stedet for to.',
  },
  {
    id: 'B2',
    title: 'Én skala: 2xs … 13xl',
    why: 'Avstand og størrelser bruker samme navn.',
  },
  {
    id: 'B3',
    title: 'Ingen marger som standard',
    why: '64 % av teksten står alene i UI.',
  },
  {
    id: 'B4',
    title: 'TextContainer gir rytmen',
    why: 'Løpende tekst får luft fra tekststilene.',
  },
  {
    id: 'B5',
    title: 'Luft = etter + før',
    why: 'Samme tall som auto layout i Figma.',
  },
  { id: 'B6', title: 'size vinner over variant', why: 'Forutsigbart.' },
  {
    id: 'B7',
    title: 'Tekst er <p> som standard',
    why: 'Tekst som står alene er et avsnitt.',
  },
  {
    id: 'B8',
    title: 'Variant for stil, komponent for struktur',
    why: 'Link er komponent, sitat er variant.',
  },
  {
    id: 'B9',
    title: 'Label for skjemafelt',
    why: 'Text variant="label" er bare stilen.',
  },
  {
    id: 'B10',
    title: 'Vekt: medium eller bold',
    why: 'Figma bruker bare 500 og 600.',
  },
  { id: 'B11', title: 'Ingen CodeBlock', why: 'Ingen bruker syntaksfarging.' },
  {
    id: 'B12',
    title: 'Kode følger teksten rundt',
    why: 'Som 12 andre designsystemer.',
  },
  {
    id: 'B13',
    title: 'Nettleserens tall, egen prikk',
    why: 'start virker, og tallene synes i kontrast.',
  },
  {
    id: 'B14',
    title: 'Tynn lenkestrek med sveip',
    why: 'Sveipet beholdes, streken er roligere.',
  },
  {
    id: 'B15',
    title: 'Ikke ikon for ekstern lenke',
    why: 'Teksten sier hvor lenken går.',
  },
  {
    id: 'B16',
    title: 'Brødtekst på alt i TextContainer',
    why: 'Tabeller og CMS-tekst blir medium.',
  },
  { id: 'B17', title: 'Typografi-tokens i @entur/tokens', why: 'Én kilde.' },
  {
    id: 'B18',
    title: 'Migrering som skill',
    why: 'Mange endringer krever skjønn.',
  },
  {
    id: 'B19',
    title: 'Ikke med: nivåkontekst, asChild',
    why: 'axe sjekker nivåene, as dekker resten.',
  },
  {
    id: 'B20',
    title: 'Text uten variant: avsnitt eller arv',
    why: 'Alene → avsnitt, inne i tekst → arver.',
  },
  {
    id: 'B21',
    title: 'Heading er h2 som standard',
    why: 'Ingen h1 ved et uhell.',
  },
  {
    id: 'B22',
    title: 'Label er 16/20, skjema bruker Label',
    why: 'Egen label-skala per visningsmodus. Skjemaskissen er eldre og følger typografien.',
  },
  {
    id: 'B23',
    title: 'Lik ekstraluft over alle overskriftsnivåer',
    why: 'Bevisst i Figma: enkelt og forutsigbart, størrelsen gir hierarkiet. Kan utvides per nivå uten brudd.',
  },
  {
    id: 'B24',
    title: '20 px etter Title-1',
    why: 'Som i Figma, også for h1 fra Markdown og CMS.',
  },
  {
    id: 'B25',
    title: 'trim er med, opt-in',
    why: 'Virker i Chrome, Safari og Firefox. Ikke på tekst som kan kuttes.',
  },
];

export type Change = { what: string; breaking?: boolean };

export const added: Change[] = [
  { what: 'TextContainer' },
  { what: 'Label' },
  { what: 'spacing={{ top, bottom }}' },
  { what: 'NumberedList variant="steps"' },
  { what: 'trim' },
  { what: 'text-wrap: balance / pretty' },
  { what: 'Typografi- og avstands-tokens' },
  { what: 'Migreringsskill' },
];

export const changed: Change[] = [
  { what: 'Avstandsskala i hele trinn (s-m → m, m → lg …)', breaking: true },
  { what: 'CSS-variabler: var(--m) → var(--spacing-lg)', breaking: true },
  {
    what: 'spacing-verdier: xs2 → 2xs, sm → s, md → m, lg → xl, xl → 3xl, md-top → { top: "m" }',
    breaking: true,
  },
  {
    what: 'CSS-klasser: .eds-text--code-text → --code, --preformatted-text → --preformatted, --blockquote → --quote',
    breaking: true,
  },
  { what: 'caption, overline, sublabel, label er <p>', breaking: true },
  {
    what: 'code-text → code, preformatted-text → preformatted',
    breaking: true,
  },
  { what: 'label 16/20', breaking: true },
  { what: 'Text uten variant', breaking: true },
  { what: 'Heading er h2 som standard', breaking: true },
  { what: 'size vinner over variant' },
  { what: 'Kodetekst' },
  { what: 'Lister' },
  { what: 'Lenke' },
  { what: 'Sitat' },
  { what: 'weight: medium | bold' },
];

export const removed: Change[] = [
  { what: 'Standardmarger', breaking: true },
  { what: 'margin', breaking: true },
  { what: 'Text size="2xl"', breaking: true },
  { what: 'Blockquote, BlockquoteFooter', breaking: true },
  { what: 'Text variant="link"', breaking: true },
  { what: 'Link external og .eds-text--link--ext-icon', breaking: true },
  {
    what: 'Klassene .eds-text--spacing-* og .eds-heading--spacing-*',
    breaking: true,
  },
];

export type FigmaItem = { what: string; details: string; waits?: string };

export const figmaUpdates: FigmaItem[] = [
  {
    what: 'Spacing-komponenten',
    details: 'Navn på den nye skalaen (M-S → M, M → LG …)',
  },
  {
    what: 'Avstand i tekstkomponentene',
    details: 'Brytere eller auto layout',
    waits: 'S1',
  },
  {
    what: 'Luft over overskrifter',
    details:
      'Ekstraluften over en overskrift brukes bare etter brødtekst, ikke når overskriften kommer rett etter en annen overskrift eller en overline',
  },
  {
    what: 'Tettere grupper',
    details: 'Avsnitt → liste 8, bildetekst og kilde 8',
    waits: 'S1',
  },
  { what: 'Luft etter bilder og komponenter', details: '24 px', waits: 'S2' },
  { what: 'Kodetekst', details: 'Nytt fyll, ingen kant, 0,875em', waits: 'S5' },
  {
    what: 'Lister',
    details: 'Prikk og ring, halvfete tall, 2xs',
    waits: 'S6',
  },
  { what: 'Steg-liste', details: 'Ny variant', waits: 'S7' },
  { what: 'Lenke', details: 'Tynn strek, sveip, ikke ikon', waits: 'S3, S4' },
  {
    what: 'Label',
    details:
      'Ny komponent, 16/20. Skjemaskissen (ETU-58913) bruker 16/24 og oppdateres når skjemaarbeidet starter',
  },
];

// Variables that differ from main in packages/tokens/src/component.json, in Figma's words

/** Tokens-Component → Component spacing: same values, new names */
export const figmaSpacingRenames: { from: string; to: string; px: number }[] = [
  { from: '2XS', to: 'Spacing/2XS', px: 4 },
  { from: 'XS', to: 'Spacing/XS', px: 8 },
  { from: 'S', to: 'Spacing/S', px: 12 },
  { from: 'S-M', to: 'Spacing/M', px: 16 },
  { from: 'M', to: 'Spacing/LG', px: 20 },
  { from: 'M-L', to: 'Spacing/XL', px: 24 },
  { from: 'L', to: 'Spacing/2XL', px: 28 },
  { from: 'XL', to: 'Spacing/3XL', px: 32 },
  { from: '2XL', to: 'Spacing/4XL', px: 36 },
  { from: '3XL … 11XL', to: 'Spacing/5XL … 13XL', px: 40 },
];

export type Swatch = { name: string; hex: string };
export type FigmaColor = {
  variable: string;
  isNew?: boolean;
  light: { from?: Swatch; to: Swatch };
  dark: { from?: Swatch; to: Swatch };
  waits?: string;
};

const blue10 = { name: 'Blue/10', hex: '#f6f6f9' };
const blue20 = { name: 'Blue/20', hex: '#eaeaf1' };
const blue100 = { name: 'Blue/100', hex: '#292b6a' };
const ebony80 = { name: 'Ebony/80', hex: '#393a49' };
const ebony90 = { name: 'Ebony/90', hex: '#212233' };

/** Tokens-Component → Component colors */
export const figmaColors: FigmaColor[] = [
  {
    variable: 'Code text / Standard / Fill',
    light: { from: blue10, to: blue20 },
    dark: { from: ebony80, to: ebony90 },
    waits: 'S5',
  },
  {
    variable: 'Code text / Contrast / Fill',
    light: { from: blue10, to: blue100 },
    dark: { from: ebony80, to: ebony90 },
    waits: 'S5',
  },
  {
    variable: 'List / Standard / Fill',
    isNew: true,
    light: { to: blue20 },
    dark: { to: ebony90 },
    waits: 'S7',
  },
  {
    variable: 'List / Contrast / Fill',
    isNew: true,
    light: { to: blue100 },
    dark: { to: ebony90 },
    waits: 'S7',
  },
];

export const remaining = [
  'Nettlesertest: Safari, Firefox, skjermleser, høykontrast, compact/display',
  'Typografidokumentasjonen skrives om',
  'Dokumentasjonssiden flyttes',
  'Egne komponenter flyttes etter graduering, før advarslene',
  '@entur/table: vanlige celler uten vekt',
  'Skills og graduering',
];

export const pullRequests = [504, 505, 506, 507, 508, 509];
