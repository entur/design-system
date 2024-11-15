import React from 'react';
import {
  ColorPickerIcon,
  SourceCodeIcon,
  EditIcon,
  GridViewIcon,
  UsersIcon,
} from '@entur/icons';

type FrontpageCards = {
  title: string;
  description: React.ReactNode;
  to: string;
  category?: string;
  titleIcon?: React.ReactNode;
  [key: string]: any;
};

export const OverviewCards: FrontpageCards[] = [
  {
    title: 'Stil og tone',
    description: (
      <>
        Hvem snakker vi til? <br /> Lær om hvordan vi bruker språket til å
        kommunisere med brukerne våre.
      </>
    ),
    to: '/kom-i-gang',
    icon: <EditIcon />,
  },
  {
    title: 'Visuell identitet',
    description: (
      <>
        Bli kjent med Entur sin merkevare.
        <br /> Veiledning og retningslinjer til deg som skal ta identiteten i
        bruk.
      </>
    ),
    to: '/identitet',
    icon: <ColorPickerIcon />,
  },
  {
    title: 'Komponenter',
    description: (
      <>
        Et rikt bibliotek med gjenbrukbare komponenter, forhåndsvisninger,
        kildekode og retningslinjer for bruk.
      </>
    ),
    to: '/komponenter',
    icon: <SourceCodeIcon />,
  },
  {
    title: 'Universell utforming',
    description: (
      <>
        Retningslinjer for design og utvikling av digitale løsninger i henhold
        til lovverket for universell utforming.
      </>
    ),
    to: '/universell-utforming',
    icon: <UsersIcon />,
  },
  {
    title: 'Tokens',
    description: (
      <>
        Alle gjenbrukbare verdier som kan brukes for å designe sider og
        komponenter som følger Entur sin visuelle identitet.
      </>
    ),
    to: '/tokens',
    icon: <UsersIcon />,
  },
  {
    title: 'Ikonbibliotek',
    description: (
      <>
        En oversikt over alle våre ikoner. <br /> Søk i oversikten og velg
        ikonet du trenger for din applikasjon.
      </>
    ),
    to: '/komponenter/ressurser/icons',
    icon: <GridViewIcon />,
  },
];
