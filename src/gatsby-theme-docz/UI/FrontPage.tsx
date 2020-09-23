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

export const FrontPage = () => {
  return (
    <>
      <Contrast>
        <div className="content-margin">
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
        </div>
        <div style={{ background: colors.blues.blue10 }}>
          <div
            className="content-margin"
            style={{ paddingTop: '6rem', paddingBottom: '6rem' }}
          >
            <GridContainer spacing="large">
              <GridItem small={6}>
                <MediaCard
                  title="For designere"
                  description="Onboarding for deg som bruker designsystemt for første gang.
                  Utforsk og lær om vår designprosess, brukergrupper,
                  brukertesting og hvilke verktøy vi bruker for å designe
                  digitale løsninger."
                  category="Kom i gang"
                  style={{ background: colors.blues.blue20 }}
                  as={Link}
                  to="/kom-i-gang/for-designere/designprosess"
                ></MediaCard>
              </GridItem>
              <GridItem small={6}>
                <MediaCard
                  title="For utviklere"
                  description="En onboardingsside med introduksjon om hvordan du kommer i
                  gang med å bruke komponentbiblioteket, installerer pakker og
                  hvordan du kan bidra til designssytemet."
                  category="Kom i gang"
                  style={{ background: colors.blues.blue20 }}
                  as={Link}
                  to="/kom-i-gang/for-utviklere/komponentbibliotek"
                ></MediaCard>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </Contrast>
      <div className="content-margin">
        <div
          style={{
            textAlign: 'center',
            marginTop: '6.5rem',
            marginBottom: '4rem',
          }}
        >
          <Heading2 margin="top">Alt du trenger i ett system</Heading2>
          <Paragraph>
            Utforsk de mest populære verktøyene du kan bruke for ditt prosjekt
          </Paragraph>
        </div>
        <GridContainer spacing="large">
          <GridItem small={6} medium={4}>
            <NavigationCard
              title="Stil og tone"
              titleIcon={<EditIcon />}
              as={Link}
              to="/kom-i-gang"
            >
              Hvem snakker vi til?
              <br /> Lær om hvordan vi bruker språket til å kommunisere med
              brukerne våre.
            </NavigationCard>
          </GridItem>
          <GridItem small={6} medium={4}>
            <NavigationCard
              title="Visuell identitet"
              titleIcon={<ColorPickerIcon />}
              as={Link}
              to="/visuell-identitet"
            >
              Bli kjent med Entur sin merkevare. <br /> Veiledning og
              retningslinjer til deg som skal ta identiteten i bruk.
            </NavigationCard>
          </GridItem>
          <GridItem small={6} medium={4}>
            <NavigationCard
              title="Komponenter"
              titleIcon={<SourceCodeIcon />}
              as={Link}
              to="/komponenter"
            >
              Et rikt bibliotek med gjenbrukbare komponenter, forhåndsvisninger,
              kildekode og retningslinjer for bruk.
            </NavigationCard>
          </GridItem>
          <GridItem small={6} medium={4}>
            <NavigationCard
              title="Universell utforming"
              titleIcon={<ViewIcon />}
              as={Link}
              to="/stil-og-tone"
            >
              Retningslinjer for design og utvikling av digitale løsninger i
              henhold til lovverket for universell utforming.
            </NavigationCard>
          </GridItem>
          <GridItem small={6} medium={4}>
            <NavigationCard
              title="Tokens"
              titleIcon={<UsersIcon />}
              as={Link}
              to="/kom-i-gang/for-utviklere/bidra"
            >
              Alle gjenbrukbare verdier som kan brukes for å designe sider og
              komponenter som følger Entur sin visuelle identitet.
            </NavigationCard>
          </GridItem>
          <GridItem small={6} medium={4}>
            <NavigationCard
              title="Ikonbibliotek"
              titleIcon={<GridViewIcon />}
              as={Link}
              to="/komponenter/ressurser/icons"
            >
              En oversikt over alle våre ikoner. <br /> Søk i oversikten og velg
              ikonet du trenger for din applikasjon.
            </NavigationCard>
          </GridItem>
        </GridContainer>
        <div
          style={{
            maxWidth: '784px',
            margin: '0 auto',
            marginBottom: '12.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={Kontakt}
              width="377px"
              alt="En mann som vinker til en dame gjennom chattebobler"
            />
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
