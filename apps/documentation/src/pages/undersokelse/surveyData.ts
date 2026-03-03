export const NOKKELTALL = [
  {
    value: '116',
    label: 'Totalt respondenter',
    change: '88% vekst',
    trend: 'up' as const,
  },
  {
    value: '4.13',
    label: 'Totaltilfredshet 2025',
    change: '0.35 fra 2022',
    trend: 'down' as const,
  },
  {
    value: '81%',
    label: 'Sparetid',
    change: '19% fra 2022',
    trend: 'down' as const,
  },
  {
    value: '87%',
    label: 'Bedre produkter',
    change: '9% fra 2022',
    trend: 'down' as const,
  },
  {
    value: '87%',
    label: 'Visuell konsistens',
    change: '13% fra 2022',
    trend: 'down' as const,
  },
];

export const SECTION_NAV = [
  { label: 'Respondenter', id: 'respondenter' },
  { label: 'Tilfredshet', id: 'tilfredshet' },
  { label: '4-års trender', id: 'trender' },
  { label: 'Verdi', id: 'verdi' },
  { label: 'Kommunikasjon', id: 'kommunikasjon' },
  { label: 'Kvalitativt', id: 'kvalitativt' },
  { label: 'Forslag', id: 'forslag' },
];

export type OppsummeringItem = {
  heading: string;
  text: string;
};

export const OPPSUMMERING = {
  styrker: [
    {
      heading: 'Høy tilfredshet:',
      text: '4.1–4.5-området alle år. 87% gir 4 eller 5 i 2025.',
    },
    {
      heading: 'Tidsbesparelse:',
      text: '81–100% opplever at de sparer tid (81% i 2025, 100% i 2022).',
    },
    {
      heading: 'Slack-kanalen er en suksess:',
      text: 'Høyeste tilfredshet (4.4–4.6) alle 4 år. Teamet roses for rask og hyggelig respons.',
    },
    {
      heading: 'Dokumentasjon:',
      text: 'linje.entur.no brukes av 85% og scorer 4.2/5 i 2025.',
    },
    {
      heading: 'Konsistens og merkevare:',
      text: '87–100% mener designsystemet sikrer visuell konsistens.',
    },
    {
      heading: 'Teamet verdsettes:',
      text: 'Kontaktens nytte scorer 4.2–4.8 over alle år. Mange nevner «flinke folk» og «rask respons».',
    },
  ] as OppsummeringItem[],
  forbedringsomrader: [
    {
      heading: 'B2B-behov underdekket:',
      text: '~20 omtaler over alle 4 år. Mangler komplekse komponenter for interne verktøy og partnerflater.',
    },
    {
      heading: 'Fargetokens er forvirrende:',
      text: '(3.76/5 i 2025, ↓0.57 fra 2024). Semantiske farger, contrast/dark mode og flere Figma-bibliotek skaper forvirring.',
    },
    {
      heading: 'Figma – React ute av synk:',
      text: 'Gjentakende tema 2023–2025. Komponentene matcher ikke mellom design og kode.',
    },
    {
      heading: 'Versjonering og pakkestrategi:',
      text: 'Separat versjonering per pakke gir smerte. Forslag om mega-pakke (ref. Digdir Designsystemet og NAVs Aksel).',
    },
    {
      heading: 'Open source / whitelabel:',
      text: 'Nytt tema i 2025. Flere ønsker åpen tilgjengelighet.',
    },
    {
      heading: 'Bidrag:',
      text: '28% i 2025 vet ikke at de kan bidra, eller ønsker å bidra men har ikke gjort det ennå.',
    },
  ] as OppsummeringItem[],
};

export const RESPONDENTPROFIL = {
  yearCards: [
    {
      year: '2022',
      count: 25,
      breakdown: '16 frontend, 8 backend, 6 UX',
    },
    {
      year: '2023',
      count: 21,
      breakdown: '11 frontend, 7 backend, 6 UX',
    },
    {
      year: '2024',
      count: 23,
      breakdown: '7 UX/UI, 7 frontend, 5 fullstack',
    },
    {
      year: '2025',
      count: 47,
      breakdown: '14 fullstack, 14 frontend, 12 design',
    },
  ],
  roller: {
    title: 'Roller 2025 (n=47, flere valg mulig)',
    data: [
      { label: 'Fullstack-utvikler', value: 14, color: 'var(--contrast-lavender)' },
      { label: 'Frontend-utvikler', value: 14, color: 'var(--contrast-lavender)' },
      { label: 'Designer', value: 12, color: 'var(--contrast-peach)' },
      { label: 'Tjenestedesigner', value: 6, color: 'var(--contrast-peach)' },
      { label: 'Backend-utvikler', value: 6, color: 'var(--contrast-blue)' },
      { label: 'Annet (Tech Lead, PL, ++)', value: 4, color: 'var(--contrast-blue)' },
    ],
  },
  primaryUsers: {
    title: 'Primære brukere 2025',
    data: [
      { label: 'B2B / Interne', value: 33, color: 'var(--contrast-azure)' },
      { label: 'Partnere', value: 26, color: 'var(--contrast-spring)' },
      { label: 'Reisende (B2C)', value: 11, color: 'var(--contrast-jungle)' },
      { label: 'Kundeservice', value: 6, color: 'var(--contrast-lilac)' },
      { label: 'Annet', value: 4, color: 'var(--contrast-blue)' },
    ],
  },
  tolkning:
    'Tolkning: Dobling av respondenter i 2025 reflekterer bredere brukerbase — inkludert B2B, partnere og backend. Nedgangen i metrikker skyldes sannsynligvis bredere representasjon, ikke kvalitetsforringelse.',
};

export type SatisfactionEntry = {
  label: string;
  score: string;
  users: string;
  segments: number[];
};

export const TILFREDSHET: {
  legend: string[];
  items: SatisfactionEntry[];
  totalScore: {
    value: string;
    subtitle: string;
    details: string[];
  };
  distribution: { label: string; count: number; percent: string; color: string }[];
} = {
  legend: [
    'Veldig fornøyd',
    'Ganske fornøyd',
    'Litt fornøyd',
    'Litt misfornøyd',
  ],
  items: [
    {
      label: '#talk-designsystem (Slack)',
      score: '4.5/5',
      users: '37 av 47 bruker (79%)',
      segments: [21, 14, 2, 0],
    },
    {
      label: 'Dokumentasjon (linje.entur.no)',
      score: '4.2/5',
      users: '40 av 47 bruker (85%)',
      segments: [13, 22, 4, 1],
    },
    {
      label: 'Entur UI Library (Figma)',
      score: '4.1/5',
      users: '19 av 47 bruker (40%)',
      segments: [4, 12, 3, 0],
    },
    {
      label: 'React-komponentbibliotek',
      score: '4.0/5',
      users: '24 av 47 bruker (51%)',
      segments: [2, 20, 2, 0],
    },
    {
      label: 'Entur color tokens (Figma)',
      score: '3.8/5',
      users: '25 av 47 bruker (53%)',
      segments: [6, 9, 8, 2],
    },
    {
      label: 'Kodebase (Bitbucket/GitHub)',
      score: '3.8/5',
      users: '9 av 47 bruker (19%)',
      segments: [1, 6, 1, 1],
    },
    {
      label: 'NPM-sidene',
      score: '3.7/5',
      users: '6 av 47 bruker (13%)',
      segments: [0, 4, 2, 0],
    },
  ],
  totalScore: {
    value: '4.13',
    subtitle: 'av 5.0 mulig',
    details: [
      '0 respondenter ga 1 eller 2.',
      '87% ga 4 eller 5.',
      'Median: 4.0',
    ],
  },
  distribution: [
    { label: '5', count: 12, percent: '26%', color: 'var(--contrast-jungle)' },
    { label: '4', count: 29, percent: '62%', color: 'var(--contrast-spring)' },
    { label: '3', count: 6, percent: '13%', color: 'var(--contrast-peach)' },
    { label: '2', count: 0, percent: '0%', color: 'var(--contrast-peach)' },
    { label: '1', count: 0, percent: '0%', color: 'var(--contrast-peach)' },
  ],
};

export type TrendRow = {
  label: string;
  values: (string | null)[];
  trend: string;
};

export const TRENDER = {
  overordnet: {
    title: 'Overordnet tilfredshet (av 5.0)',
    years: ['2022', '2023', '2024', '2025'],
    values: ['4.48', '4.29', '4.39', '4.13'],
  },
  tidsbesparelse: {
    title: 'Tidsbesparelse',
    years: ['2022', '2023', '2024', '2025'],
    values: ['100%', '95%', '96%', '81%'],
  },
  visuellKonsistens: {
    title: 'Visuell konsistens',
    years: ['2022', '2023', '2024', '2025'],
    values: ['96%', '100%', '100%', '87%'],
  },
  komponentTilfredshet: {
    title: 'Komponenttilfredshet over tid (av 5.0)',
    headers: ['Komponent', '2022', '2023', '2024', '2025', 'Δ Trend'],
    rows: [
      {
        label: '#talk-designsystem',
        values: ['4.56', '4.44', '4.47', '4.51'],
        trend: '↔ Stabil',
      },
      {
        label: 'Dokumentasjon',
        values: ['4.40', '4.33', '4.21', '4.17'],
        trend: '↓ 0.23',
      },
      {
        label: 'React-komponenter',
        values: ['4.30', '4.58', '4.18', '4.00'],
        trend: '↓ 0.30',
      },
      {
        label: 'Figma UI Library',
        values: ['4.18', '4.27', '4.18', '4.05'],
        trend: '↓ 0.13',
      },
      {
        label: 'Fargetokens (Figma)',
        values: [null, null, '4.33', '3.76'],
        trend: '↓ 0.57',
      },
      {
        label: 'NPM-sider',
        values: ['3.50', '4.00', '4.20', '3.67'],
        trend: '↕ Variabel',
      },
    ] as TrendRow[],
  },
};

export type BarChartEntry = {
  label: string;
  value: number;
  percent?: string;
  color?: string;
};

export const VERDI_IMPACT = {
  sparerTid: {
    title: 'Sparer du tid?',
    data: [
      { label: 'Ja', value: 38, percent: '81%', color: 'var(--contrast-jungle)' },
      { label: 'Nei / Ikke relevant', value: 3, percent: '6%', color: 'var(--contrast-coral)' },
      { label: 'Bruker ikke / annet', value: 6, percent: '13%', color: 'var(--contrast-peach)' },
    ],
  },
  hvaSparerTid: {
    title: 'Hva spares tid på? (oppsummert)',
    data: [
      {
        count: '~25×',
        text: 'Slipper å lage / vedlikeholde egne komponenter',
      },
      { count: '~8×', text: 'Slipper å velge farger, fonter, CSS' },
      {
        count: '~5×',
        text: 'Kan fokusere på logikk / innhold fremfor form',
      },
      { count: '~4×', text: 'Skjemaer og standardiserte patterns' },
    ],
  },
  bedreProdukter: {
    title: 'Bedre produkter?',
    data: [
      { label: 'Ja', value: 41, percent: '87%', color: 'var(--contrast-jungle)' },
      { label: 'Nei', value: 2, percent: '4%', color: 'var(--contrast-coral)' },
    ],
  },
  visuellKonsistens: {
    title: 'Visuell konsistens på tvers?',
    data: [
      { label: 'Ja', value: 41, percent: '87%', color: 'var(--contrast-jungle)' },
      { label: 'Nei', value: 2, percent: '4%', color: 'var(--contrast-coral)' },
    ],
  },
};

export const KOMMUNIKASJON = {
  oppdateringer: {
    title: 'Får med seg oppdateringer? (2025)',
    data: [
      { label: 'Ja', value: 34, percent: '72%', color: 'var(--contrast-jungle)' },
      { label: 'Nei', value: 7, percent: '15%', color: 'var(--contrast-coral)' },
      { label: 'Delvis / Vet ikke', value: 6, percent: '13%', color: 'var(--contrast-peach)' },
    ],
    trend:
      '4-års trend: 64% (2022) → 81% (2023) → 73% (2024) → 74% (2025)',
  },
  kanaler: {
    title: 'Ønskede informasjonskanaler (2025)',
    data: [
      { label: 'Slack', value: 42, color: 'var(--contrast-blue)' },
      { label: 'linje.entur.no', value: 26, color: 'var(--contrast-azure)' },
      { label: 'Periodisk demo', value: 13, color: 'var(--contrast-spring)' },
      { label: 'Figma', value: 6, color: 'var(--contrast-peach)' },
    ],
    trend:
      'Totalt over 4 år: Slack 111 (96%), Demo 40 (35%), Linje 37 (32%)',
  },
  kontakt: {
    title: 'Kontakt med teamet siste år',
    ja: { percent: '72%', count: 34 },
    nei: { percent: '26%', count: 12 },
    nytte: 'Nytte av kontakt: 4.2/5',
    trend:
      '4-års trend: 4.76 (2022) → 4.43 (2023) → 4.52 (2024) → 4.22 (2025)',
  },
  bidrag: {
    title: 'Har du bidratt til designsystemet? (2025)',
    data: [
      { label: 'Ja', value: 25, percent: '53%', color: 'var(--contrast-jungle)' },
      { label: 'Nei', value: 9, percent: '19%', color: 'var(--contrast-coral)' },
      { label: 'Vil gjerne', value: 7, percent: '15%', color: 'var(--contrast-lilac)' },
      { label: 'Visste ikke at man kan', value: 5, percent: '11%', color: 'var(--contrast-peach)' },
    ],
    trend:
      '4-års trend: 60% (2022) → 67% (2023) → 64% (2024) → 53% (2025) har bidratt',
  },
  onboarding: {
    title: 'Innføring / Onboarding (2025)',
    data: [
      { label: 'Noen i teamet mitt', value: 19, color: 'var(--contrast-lavender)' },
      { label: 'Designsystem-teamet', value: 15, color: 'var(--contrast-blue)' },
      { label: 'Trenger ikke, dok er nok', value: 11, color: 'var(--contrast-lavender)' },
      { label: 'Ikke fått innføring', value: 5, color: 'var(--contrast-coral)' },
    ],
  },
};

export type FeedbackQuote = {
  text: string;
  source: string;
};

export type FeedbackIssue = {
  count: string;
  title: string;
  description: string;
};

export const KVALITATIVE = {
  fungerBra: {
    title: '✓ Hva fungerer bra?',
    quotes: [
      {
        text: '«Linje er en gullressurs.»',
        source: 'Frontend-/Fullstack-utvikler, 2025',
      },
      {
        text: '«Alltid hyggelige svar fra dyktige folk! Funker fint å kunne søke opp komponenter.»',
        source: 'Designer, 2025',
      },
      {
        text: '«Enkelt å ta i bruk, hyppige oppdateringer, oversiktlig dokumentasjon, veldig god støtte fra teamet.»',
        source: 'Frontend-utvikler, 2025',
      },
      {
        text: '«Stabilt, konsistent og enkelt å ta i bruk. De ferdige komponentene dekker grunnleggende behov.»',
        source: 'Frontend-utvikler, 2025',
      },
      {
        text: '«Dere er gode til å svare og er lett tilgjengelig. Fint at vi kan følge prosessen i Jira.»',
        source: 'Designer, 2025',
      },
      {
        text: '«Nettsiden er konge.»',
        source: 'Produktleder, 2025',
      },
      {
        text: '«Raskt å ta i bruk, finner veldig mye relevant.»',
        source: 'Respondent, 2022',
      },
      {
        text: '«Slipper å lage egne implementasjoner.»',
        source: 'Gjennomgangstema, alle år',
      },
      {
        text: '«Det var utrolig fint da Natacha kom innom teamet!»',
        source: 'Respondent, 2025',
      },
    ] as FeedbackQuote[],
  },
  fungerIkke: {
    title: '✗ Hva fungerer IKKE så bra? (Tematisert over 4 år)',
    issues: [
      {
        count: '~20×',
        title: 'B2B/interne verktøy underdekket:',
        description:
          'Systemet oppleves som B2C-fokusert. Mangler tabeller, avanserte filtre, autocomplete, layout-komponenter. Gjentatt alle 4 år.',
      },
      {
        count: '~15×',
        title: 'Fargetokens forvirrende:',
        description:
          'Semantiske farger uklare, contrast/dark mode frustrerende, flere Figma-bibliotek skaper forvirring, navngiving inkonsistent Figma ↔ kode. Eskalerende 2024–2025.',
      },
      {
        count: '~10×',
        title: 'Figma ↔ React ute av synk:',
        description:
          'Komponentene stemmer ikke mellom design og kode. Ingen 1:1-mapping. Gjentatt 2023–2025.',
      },
      {
        count: '~8×',
        title: 'Versjonering/pakkestrategi:',
        description:
          'Separat versjonering per pakke gir forvirring. Uklart hvilke pakker hører sammen. Breaking changes smertefulle.',
      },
      {
        count: '~7×',
        title: 'Kapasitet/leveransetid:',
        description:
          '«Bare én utvikler» tidlig. Forbedret, men fiks kan ta tid. Sterkest 2022–2023.',
      },
      {
        count: '~5×',
        title: 'Dokumentasjon ujevn:',
        description:
          'Noen komponenter godt dokumentert, andre mangler detaljer/eksempler. Søk vanskelig.',
      },
      {
        count: '~4×',
        title: 'Open source / whitelabel:',
        description:
          'Vanskelig å bruke i OS-prosjekter. Nytt tema 2025.',
      },
      {
        count: '~3×',
        title: 'Figma-filer rotete:',
        description:
          'For mange separerte filer. Vanskelig å finne frem.',
      },
      {
        count: '~2×',
        title: 'Komponenter lite fleksible:',
        description:
          'Noen komponenter vanskelige å tilpasse til spesifikke behov.',
      },
    ] as FeedbackIssue[],
  },
};

export type ImprovementItem = {
  number: number;
  title: string;
  description: string;
  actions: string[];
  priority: 'Høy' | 'Medium' | 'Lavere';
};

export const FORBEDRINGSFORSLAG: ImprovementItem[] = [
  {
    number: 1,
    title: 'Forenkle fargetokens',
    description:
      'Mest akutt. Lavest score (3.76/5), flest klager. Semantiske farger uklare, flere Figma-bibliotek forvirrer, navngiving inkonsistent mellom Figma og kode.',
    actions: [
      'Ett fargebibliotek i Figma',
      'Mer eksempler på riktig bruk',
      'Synkroniser navngiving Figma ↔ kode',
      'Fargeguide med use-cases',
      'Gjør contrast/dark mode lettere',
    ],
    priority: 'Høy',
  },
  {
    number: 2,
    title: 'Synkroniser Figma og React',
    description:
      'Gjentatt 3 år. Vis Figma-komponenter i Linje, avdekk ulikheter automatisk.',
    actions: [
      'Figma-komp. direkte i Linje',
      'Automatisert avviks-deteksjon',
      'Vurder Figma-plugins / CI-sjekker',
    ],
    priority: 'Høy',
  },
  {
    number: 3,
    title: 'Mer B2B-støtte',
    description:
      'Mest konsistente forespørsel alle 4 år (~20 omtaler). Komplekse komponenter for interne verktøy, tabeller, autofyll, layoutkomponenter.',
    actions: [
      'B2B-utvidelse med tabeller/filtre',
      'Layout-komp. for admin',
      'Building block-tilnærming',
      'Dialog med partner-team',
    ],
    priority: 'Høy',
  },
  {
    number: 4,
    title: 'Felles versjonering',
    description:
      'Vurder mega-pakke eller felles versjoner (ref. NAV/Aksel). Synliggjør pakkeavhengigheter.',
    actions: ['Mega-pakke / versjonsmatrise', 'Referanse: NAV Aksel'],
    priority: 'Medium',
  },
  {
    number: 5,
    title: 'Open source / whitelabel',
    description:
      'Gjør designsystemet tilgjengelig for whitelabel og open source-bruk.',
    actions: ['Evaluer whitelabel-mulighet'],
    priority: 'Medium',
  },
  {
    number: 6,
    title: 'Bidrag-onboarding',
    description:
      '28% ønsker å bidra eller visste ikke de kunne. Gjør bidragsveien tydeligere. Fortsett teambesøk (Natacha-modellen).',
    actions: [
      'Steg-for-steg guide i Linje',
      '«Lunsj med DS-teamet»',
      'Årlig «Hva er nytt»-demo',
    ],
    priority: 'Medium',
  },
  {
    number: 7,
    title: 'AI-støtte',
    description:
      'MCP for linje.entur.no, nedlastbar designfil for bruk med AI-verktøy.',
    actions: [],
    priority: 'Lavere',
  },
  {
    number: 8,
    title: 'Bedre changelogs',
    description:
      'Tydeligere kommunikasjon av breaking changes. Vurder nyhetsbrev.',
    actions: [],
    priority: 'Lavere',
  },
];

export const KONKLUSJON = [
  {
    title: 'Linje er verdsatt',
    description:
      'Konsekvent høy tilfredshet (4.1–4.5) over fire år. Teamets tilgjengelighet, Slack-støtte og dokumentasjon er sterke differensiatorer.',
  },
  {
    title: 'Nedgang er kontekst, ikke kvalitet',
    description:
      'Dalende trender reflekterer bredere, mer mangfoldig brukerbase (B2B, partnere, backend) — ikke kvalitetsforringelse.',
  },
  {
    title: '3 fokusområder = 70–80% av feedback',
    description:
      'Forenkle farger/tokens, styrke B2B-støtte og synkronisere Figma ↔ React adresserer det store flertallet av gjentatte tilbakemeldinger.',
  },
];
