import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'gatsby';

import { SkipToContent } from '@entur/a11y';
import { PrimaryButton, SecondaryButton } from '@entur/button';
import { Contrast, NavigationCard } from '@entur/layout';
import { colors } from '@entur/tokens';
import { Heading1, Paragraph, Heading2 } from '@entur/typography';

import Footer from '@components/Footer/Footer';
import { SEO } from '@components/seo/SEO';

import TopNavigationLayout from '../layouts/TopNavigationLayout';

import {
  LinjeLines,
  LinjeTopographicTop,
  LinjeTopographicBottom,
} from '@media/images/frontpage/Linjer2';

import './index.scss';

// TODO: don't use beta version of layout when merging PR
const Index = () => {
  const [backgroundHeight, setBackgroundHeight] = useState(0);
  const footerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setBackgroundHeight(
      (mainRef.current?.clientHeight ?? 0) +
        (footerRef.current?.clientHeight ?? 0),
    );
  }, []);
  return (
    <>
      <SkipToContent mainId="frontpage-content">
        Gå til hovedinnhold
      </SkipToContent>
      <Contrast data-color-mode="contrast">
        <TopNavigationLayout data-color-mode="contrast" />
        <div
          className="frontpage"
          // @ts-expect-error css-variable inline is supported
          // We use the height of the content to set a correct height for the background
          style={{ '--background-height': `${backgroundHeight}px` }}
        >
          <LinjeTopographicBottom className="frontpage__background__topographic-bottom" />
          <LinjeTopographicTop className="frontpage__background__topographic-top" />
          <LinjeLines className="frontpage__background__lines" />
          <main ref={mainRef} className="frontpage__main">
            <div className="frontpage__main__hero">
              <div className="frontpage__main__hero__content">
                <Heading1 className="frontpage__main__hero__content__main-heading">
                  <span className="frontpage__main__hero__content__main-heading__start">
                    Navn
                  </span>
                  <ShiftingHeader />
                </Heading1>
                <PrimaryButton as={Link} to="/kom-i-gang">
                  Kom i gang
                </PrimaryButton>
                <Heading2 className="frontpage__main__hero__content__secondary-heading">
                  Alt du trenger i ett system
                </Heading2>
                {NAVIGATION_CARDS.map(card => {
                  return (
                    <NavigationCard
                      title={card.title}
                      as={Link}
                      to={card.linkTo}
                      className="frontpage__main__hero__content__navigation-cards__card"
                    >
                      {card.description}
                    </NavigationCard>
                  );
                })}
              </div>
            </div>
            <div
              className="frontpage__main__section"
              style={{
                '--section-color': 'var(--basecolors-frame-contrastalt)',
              }}
            >
              <Heading2>Vil du bidra?</Heading2>
              <Paragraph>
                Designsystemet er et levende produkt som oppdateres og
                vedlikeholdes kontinuerlig. Kjerneteamet er ansvarlig for
                forvalting og support av designsystemet, men eierskapet deles
                mellom alle designere og uviklere av Entur.
              </Paragraph>
              <Paragraph>
                Alle med interesse for å påvirke utviklingen, ha innflytelse på
                designsystems innhold eller gi tilbakemeldinger er velkomne. Ta
                en titt på vår bidra side for hvordan du går frem.
              </Paragraph>
              <SecondaryButton
                as={Link}
                to="/kom-i-gang/for-utviklere/bidra-med-kode"
              >
                Se hvordan du kan bidra
              </SecondaryButton>
            </div>
          </main>
          <Footer footerRef={footerRef} forceColorMode="contrast" />
        </div>
      </Contrast>
    </>
  );
};

export default Index;

const NAVIGATION_CARDS = [
  {
    title: 'Stil og tone',
    description:
      'hvordan språket vårt skaper tydelig og brukervennlig kommunikasjon',
    icon: undefined,
    linkTo: '/komponenter',
  },
  {
    title: 'Visuell identitet',
    description: 'Veiledning og retningslinjer for bruk av Enturs merkevare',
    icon: undefined,
    linkTo: '/komponenter',
  },
  {
    title: 'Komponenter',
    description: 'Gjenbrukbare komponenter med kildekode og retningslinjer.',
    icon: undefined,
    linkTo: '/komponenter',
  },
  {
    title: 'Universell utforming',
    description: 'Retningslinjer for lovpålagt inkluderende design.',
    icon: undefined,
    linkTo: '/komponenter',
  },
  {
    title: 'Tokens',
    description: 'Små, gjenbrukbare verdier som representerer enhetlig design.',
    icon: undefined,
    linkTo: '/komponenter',
  },
  {
    title: 'Ikonbibliotek',
    description: 'En oversikt over alle våre ikoner.',
    icon: undefined,
    linkTo: '/komponenter',
  },
];

const SHIFTING_HEADER_WORDS = [
  'er til for å sikre visuell konsistens',
  'leder deg i riktig retning',
  'tar deg raskere til mål',
  'gjør det lett å gjøre rett',
  'er her for å hjelpe deg',
  'støtter mørk modus',
  'gjør løsningene dine mer tilgjengelige',
  'setter standarder på tvers',
  'er glad i deg',
  'får designet til å gå på skinner',
  'unngår design-kollisjoner',
];

function ShiftingHeader() {
  const [currentIndex, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(
      () =>
        setIndex(prev => {
          const newIndex =
            Math.floor(Math.random() * SHIFTING_HEADER_WORDS.length) %
            SHIFTING_HEADER_WORDS.length;
          if (newIndex === prev)
            return (newIndex + 1) % SHIFTING_HEADER_WORDS.length;
          return newIndex;
        }),
      5000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span
      key={SHIFTING_HEADER_WORDS[currentIndex]}
      className="frontpage__main__hero__content__main-heading__end shifting-header"
      style={{ fontWeight: 600, color: colors.brand.coral }}
    >
      {`\n${SHIFTING_HEADER_WORDS[currentIndex]}`}
    </span>
  );
}

export const Head = () => {
  return <SEO />;
};
