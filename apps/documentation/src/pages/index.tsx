import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'gatsby';
import classNames from 'classnames';

import { SkipToContent } from '@entur/a11y';
import { PrimaryButton, SecondaryButton } from '@entur/button';
import {
  ColorPickerIcon,
  ComponentIcon,
  IconIcon,
  TokenIcon,
  ToneSmileIcon,
  ViewIcon,
} from '@entur/icons';
import { Contrast, NavigationCard } from '@entur/layout';
import { colors } from '@entur/tokens';
import { Heading1, Paragraph, Heading2 } from '@entur/typography';
import { useWindowDimensions } from '@entur/utils';

import Footer from '@components/Footer/Footer';
import { SEO } from '@components/seo/SEO';

import TopNavigationLayout from '../layouts/TopNavigationLayout';

import {
  LinjeLines,
  LinjeTopographicTop,
  LinjeTopographicBottom,
} from '@media/images/frontpage/BackgroundElements';

import './index.scss';

// TODO: don't use beta version of layout when merging PR
const Index = () => {
  const { width } = useWindowDimensions();
  const [backgroundHeight, setBackgroundHeight] = useState(0);
  const footerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const _width = Math.floor(width ?? 0 / 100);

  useEffect(() => {
    const contentHeight =
      (mainRef.current?.clientHeight ?? 0) +
      (footerRef.current?.clientHeight ?? 0);
    setBackgroundHeight(contentHeight);
  }, [_width]);

  const animatedCircleRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  let animationFrameId = useRef<number>(null); // Store the animation frame ID

  useEffect(() => {
    const checkOverlap = () => {
      if (!animatedCircleRef.current || !svgRef.current) return;

      const circleBox = animatedCircleRef.current.getBoundingClientRect();
      const targets = svgRef.current.querySelectorAll('.animated');

      targets.forEach(target => {
        const targetBox = target.getBoundingClientRect();
        const isOverlapping =
          circleBox.right > targetBox.left &&
          circleBox.left < targetBox.right &&
          circleBox.bottom > targetBox.top &&
          circleBox.top < targetBox.bottom;

        target.setAttribute(
          'stroke',
          isOverlapping
            ? 'var(--basecolors-stroke-light)'
            : 'var(--basecolors-stroke-contrast)',
        );
      });

      // Run the overlap detection for the next frame
      animationFrameId.current = requestAnimationFrame(checkOverlap);
    };

    animationFrameId.current = requestAnimationFrame(checkOverlap);

    return () => {
      // Cleanup on unmount
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <>
      <SkipToContent mainId="frontpage-content">
        Gå til hovedinnhold
      </SkipToContent>
      <Contrast data-color-mode="contrast">
        <TopNavigationLayout data-color-mode="contrast" />
        <div
          className={classNames('frontpage', {
            'frontpage__background--loaded': backgroundHeight > 0,
          })}
          // @ts-expect-error css-variable inline is supported
          // We use the height of the content to set a correct height for the background
          style={{ '--background-height': `${backgroundHeight}px` }}
        >
          <div className="frontpage__background__animation">
            <div
              ref={animatedCircleRef}
              className="frontpage__background__animation__traveller first"
            />
            <div className="frontpage__background__animation__traveller second" />
          </div>
          <LinjeTopographicBottom className="frontpage__background__topographic-bottom" />
          <LinjeTopographicTop className="frontpage__background__topographic-top" />
          <LinjeLines
            svgRef={svgRef}
            className="frontpage__background__lines"
          />
          <main ref={mainRef} className="frontpage__main">
            <div className="frontpage__main__hero">
              <div className="frontpage__main__hero__content">
                <Heading1 className="frontpage__main__hero__content__main-heading">
                  <span className="frontpage__main__hero__content__main-heading__start">
                    Linje
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
                      titleIcon={card.icon}
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
                '--section-color': 'var(--basecolors-frame-contrastalt-2)',
              }}
            >
              <Heading2>Vil du bidra?</Heading2>
              <Paragraph>
                Entur Linje er et levende produkt som oppdateres og
                vedlikeholdes kontinuerlig. Designsystem-teamet er ansvarlig for
                forvalting og support, men eierskapet deles mellom alle i Entur.
              </Paragraph>
              <Paragraph>
                Alle med interesse for å påvirke utvikling og eller innhold,
                eller ønsker å gi tilbakemeldinger er hjertelig velkomne. Ta en
                titt på vår bidra side for hvordan du går frem.
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
      'Retningslinjer for å skape en tydelig og brukervennlig kommunikasjon.',
    icon: <ToneSmileIcon />,
    linkTo: '/identitet/introduksjon/stil-og-tone',
  },
  {
    title: 'Visuell identitet',
    description:
      'Veiledning og retningslinjer for bruk av Entur sin merkevare.',
    icon: <ColorPickerIcon />,
    linkTo: '/identitet',
  },
  {
    title: 'Komponenter',
    description:
      'Gjenbrukbare komponenter med retningslinjer for React og Figma.',
    icon: <ComponentIcon />,
    linkTo: '/komponenter',
  },
  {
    title: 'Universell utforming',
    description:
      'Retningslinjer for hvordan lage løsninger som er gode å bruke for flest mulig mennesker.',
    icon: <ViewIcon />,
    linkTo: '/universell-utforming',
  },
  {
    title: 'Tokens',
    description: 'Små, gjenbrukbare verdier som representerer enhetlig design.',
    icon: <TokenIcon />,
    linkTo: '/tokens',
  },
  {
    title: 'Ikonbibliotek',
    description: 'En oversikt over alle våre ikoner.',
    icon: <IconIcon />,
    linkTo: '/komponenter/ressurser/icons',
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
  'er designsystemet til Entur',
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
  return <SEO title="Forside" />;
};
