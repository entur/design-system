import React from 'react';
import { Link } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';

import { PrimaryButton } from '@entur/button';
import { colors } from '@entur/tokens';
import { GridContainer, GridItem } from '@entur/grid';
import { Contrast, NavigationCard } from '@entur/layout';
import { Heading1, Paragraph, Heading2 } from '@entur/typography';

import FrontPageFooter from '@components/Footer/FrontPageFooter';
import { OverviewCards } from '@components/Cards/FrontPageCards';
import TopNavigationLayout from '../layouts/TopNavigationLayout';
import { Media } from '@providers/MediaBreakpoint';
import { SkipToContent } from '@entur/a11y';
import { SEO } from '@components/seo/SEO';

import './index.scss';

const Index = () => (
  <>
    <SkipToContent mainId="frontpage-content">
      Gå til hovedinnhold
    </SkipToContent>
    <Contrast>
      <TopNavigationLayout />
    </Contrast>
    <div className="frontpage__site-content-wrapper">
      <main>
        <Contrast className="front-page__top">
          <div className="content-margin">
            <Media greaterThanOrEqual="desktop" className="front-page__desktop">
              <div style={{ position: 'relative' }}>
                <div id="frontpage-content">
                  <div style={{ paddingTop: '6rem' }}>
                    <Heading1 style={{ fontWeight: 500 }}>
                      Entur Designsystem
                    </Heading1>
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
                  <StaticImage
                    src="../media/images/frontpage/FrontpageImage.png"
                    alt="Tegning av en by med kollektivtrafikk"
                    placeholder="none"
                  />
                </div>
              </div>
            </Media>
            <Media at="mobile" className="front-page__mobile">
              <div style={{ paddingTop: '2rem', paddingBottom: '1.5rem' }}>
                <Heading1>
                  Velkommen til <br /> Entur Designsystem
                </Heading1>
                <Paragraph>
                  Bruk vårt system med gjenbrukbare designelementer og
                  frontend-kode for å oppnå visuell konsistens som er oppdatert
                  i henhold til vår grafiske profil.
                </Paragraph>
                <StaticImage
                  src="../media/images/frontpage/FrontpageImage.png"
                  alt="Tegning av en by med kollektivtrafikk"
                  placeholder="none"
                />
              </div>
            </Media>
          </div>
        </Contrast>
        <div className="front-page__blue-cards">
          <div className="content-margin">
            <div className="front-page__second-intro">
              <Heading2 margin="top">Alt du trenger i ett system</Heading2>
              <Paragraph>
                Utforsk de mest populære verktøyene du kan bruke for ditt
                prosjekt
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
                    />
                  </GridItem>
                ))}
              </GridContainer>
            </Media>
          </div>
        </div>
        <div className="content-margin">
          <div className="front-page__last-section">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <StaticImage
                width={500}
                src="../media/images/frontpage/kontakt.png"
                alt=""
                placeholder="none"
              />
            </div>
            <Heading2>Vil du bidra?</Heading2>
            <Paragraph>
              Designsystemet er et levende produkt som oppdateres og
              vedlikeholdes kontinuerlig. Kjerneteamet er ansvarlig for
              forvalting og support av designsystemet, men eierskapet deles
              mellom alle designere og uviklere av Entur.
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
              to="/kom-i-gang/for-utviklere/bidra-med-kode"
            />
          </div>
        </div>
      </main>
      <FrontPageFooter />
    </div>
  </>
);

export default Index;

const SHIFTING_HEADER_WORDS = [
  'sikrer visuell konsistens',
  'reduserer dobbeltarbeid',
  'oppnår raskere utviklingstid',
];

function ShiftingHeader() {
  const [currentIndex, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(
      () => setIndex(prev => (prev + 1) % SHIFTING_HEADER_WORDS.length),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="shifting-header">
      <Heading1
        key={SHIFTING_HEADER_WORDS[currentIndex]}
        className="fade-in-out"
        style={{ fontWeight: 600, color: colors.brand.coral }}
      >
        {SHIFTING_HEADER_WORDS[currentIndex]}
      </Heading1>
    </div>
  );
}

export const Head = () => {
  return <SEO />;
};
