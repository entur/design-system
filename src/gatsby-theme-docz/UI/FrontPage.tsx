import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heading1, Heading2, Paragraph } from '@entur/typography';
import { colors } from '@entur/tokens';
import { GridContainer, GridItem } from '@entur/grid/dist';
import { NavigationCard, Contrast, MediaCard } from '@entur/layout';
import { Link } from 'docz';
import {
  ViewIcon,
  ColorPickerIcon,
  SourceCodeIcon,
  EditIcon,
  GridViewIcon,
  UsersIcon,
} from '@entur/icons';
import { PrimaryButton } from '@entur/button/dist';
import Kontakt from './Kontakt.jpg';
import FrontPageImage from './FrontpageImage.png';
import './FrontPage.scss';
import { Media } from '~/utils/MediaBreakpoint';

export const FrontPage = () => {
  return (
    <>
      <Contrast>
        <div className="content-margin">
          <Media greaterThanOrEqual="desktop">
            <div style={{ position: 'relative' }}>
              <div>
                <div style={{ paddingTop: '6rem' }}>
                  <Heading1>Entur Designsystem</Heading1>
                  <ShiftingHeader />
                </div>
                <div
                  style={{
                    paddingTop: '2.5rem',
                    width: '218px',
                    paddingBottom: '12rem',
                  }}
                >
                  <PrimaryButton as={Link} to="/kom-i-gang" width="fluid">
                    Kom i gang
                  </PrimaryButton>
                </div>
              </div>
              <div className="front-page__top-image" style={{}}>
                <img
                  src={FrontPageImage}
                  width="100%"
                  alt="Tegning av en by med kollektivtrafikk"
                />
              </div>
            </div>
          </Media>
          <Media at="mobile">
            <div style={{ paddingTop: '2rem', paddingBottom: '1.5rem' }}>
              <Heading1>
                Velkommen til <br /> Entur Designsystem
              </Heading1>
              <Paragraph>
                Bruk vårt system med gjenbrukbare designelementer og
                frontend-kode for å oppnå visuell konsistens som er oppdatert i
                henhold til vår grafiske profil.
              </Paragraph>
              <img
                src={FrontPageImage}
                width="100%"
                alt="Tegning av en by med kollektivtrafikk"
              />
            </div>
          </Media>
        </div>
        <div
          style={{ background: colors.blues.blue10 }}
          className="content-margin"
        >
          <Media greaterThanOrEqual="desktop">
            <GridContainer spacing="large">
              {OpeningCards.map(openingCard => (
                <GridItem small={6} key={openingCard.title + 'desktop'}>
                  <MediaCard
                    title={openingCard.title}
                    description={openingCard.description}
                    category={openingCard.category}
                    style={{ background: colors.blues.blue20 }}
                    as={Link}
                    to={openingCard.to}
                  ></MediaCard>
                </GridItem>
              ))}
            </GridContainer>
          </Media>
          <Media at="mobile">
            <GridContainer spacing="large" style={{ padding: '2rem 0' }}>
              {OpeningCards.map(openingCard => (
                <GridItem small={12} key={openingCard.title + 'mobile'}>
                  <NavigationCard
                    title={openingCard.title}
                    style={{ background: colors.blues.blue20 }}
                    as={Link}
                    to={openingCard.to}
                    compact
                  ></NavigationCard>
                </GridItem>
              ))}
            </GridContainer>
          </Media>
        </div>
      </Contrast>
      <div className="content-margin">
        <div className="front-page__second-intro">
          <Heading2 margin="top">Alt du trenger i ett system</Heading2>
          <Paragraph>
            Utforsk de mest populære verktøyene du kan bruke for ditt prosjekt
          </Paragraph>
        </div>
        <Media greaterThanOrEqual="desktop">
          <GridContainer spacing="large">
            {OverviewCards.map(card => (
              <GridItem
                small={12}
                medium={6}
                large={4}
                key={card.title + 'desktop'}
              >
                <NavigationCard
                  title={card.title}
                  titleIcon={card.icon}
                  as={Link}
                  to={card.to}
                >
                  {card.description}
                </NavigationCard>
              </GridItem>
            ))}
          </GridContainer>
        </Media>
        <Media at="mobile">
          <GridContainer spacing="large">
            {OverviewCards.map(card => (
              <GridItem small={12} key={card.title + 'mobile'}>
                <NavigationCard
                  title={card.title}
                  as={Link}
                  to={card.to}
                  compact
                ></NavigationCard>
              </GridItem>
            ))}
          </GridContainer>
        </Media>
        <div className="front-page__last-section">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src={Kontakt} width="377px" alt="" />
          </div>
          <Heading2>Vil du bidra?</Heading2>
          <Paragraph>
            Designsystemet er et levende produkt som oppdateres og vedlikeholdes
            kontinuerlig. Kjerneteamet er ansvarlig for forvalting og support av
            designsystemet, men eierskapet deles mellom alle designere og
            uviklere av Entur.
          </Paragraph>
          <Paragraph>
            Alle med interesse for å påvirke utviklingen, ha innflytelse på
            designsystems innhold eller gi tilbakemeldinger er velkomne. Ta en
            titt på vår bidra side for hvordan du går frem.
          </Paragraph>
          <NavigationCard
            compact
            title="Se hvordan du kan bidra"
            style={{ marginTop: '3rem' }}
            as={Link}
            to="/kom-i-gang/for-utviklere/bidra"
          />
        </div>
      </div>
    </>
  );
};

function ShiftingHeader() {
  const words = [
    'er til for å sikre visuell konsistens',
    'reduserer dobbeltarbeid',
    'oppnår raskere utviklingstid',
  ];
  const [currentIndex, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(
      () => setIndex(prev => (prev + 1) % words.length),
      5000,
    );
    return () => clearInterval(id);
  }, [words]);
  return (
    <AnimatePresence exitBeforeEnter>
      <motion.div
        variants={{
          up: { opacity: 0, y: -40 },
          visible: { y: 0, opacity: 1 },
          down: { y: 40, opacity: 0 },
        }}
        initial="up"
        animate="visible"
        exit="down"
        transition={{ ease: 'easeOut' }}
        key={words[currentIndex]}
      >
        <Heading1 style={{ fontWeight: 600, color: colors.brand.coral }}>
          {words[currentIndex]}
        </Heading1>
      </motion.div>
    </AnimatePresence>
  );
}

type FrontpageCards = {
  title: string;
  description: React.ReactNode;
  to: string;
  category?: string;
  titleIcon?: React.ReactNode;
  [key: string]: any;
};

const OpeningCards: FrontpageCards[] = [
  {
    title: 'For designere',
    description:
      'Onboarding for deg som bruker designsystemt for første gang. Utforsk og lær om vår designprosess, brukergrupper, brukertesting og hvilke verktøy vi bruker for å designe digitale løsninger.',
    category: 'Kom i gang',
    to: '/kom-i-gang/for-utviklere/komponentbibliotek',
  },
  {
    title: 'For utviklere',
    description:
      'En onboardingsside med introduksjon om hvordan du kommer i gang med å bruke komponentbiblioteket, installerer pakker og hvordan du kan bidra til designssytemet.',
    category: 'Kom i gang',
    to: '/kom-i-gang/for-designere/designprosess',
  },
];

const OverviewCards: FrontpageCards[] = [
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
    to: '/komponenter/ressurser/tokens',
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
