import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { SkipToContent } from '@entur/a11y';
import {
  BackArrowIcon,
  ConfigurationIcon,
  LikeIcon,
  StarredIcon,
} from '@entur/icons';
import { Contrast } from '@entur/layout';
import { IconButton } from '@entur/button';
import { useWindowDimensions } from '@entur/utils';

import { Link } from 'gatsby';
import { SEO } from '@components/seo/SEO';

import TopNavigationLayout from '../../../layouts/TopNavigationLayout';

import {
  LinjeLines,
  LinjeTopographicBottom,
  LinjeTopographicTop,
} from '@media/images/frontpage/BackgroundElements';

import DataCard from '@components/Survey/DataCard';
import {
  FeedbackIssues,
  FeedbackQuotes,
} from '@components/Survey/FeedbackList';
import HorizontalBarChart from '@components/Survey/HorizontalBarChart';
import ImprovementCard from '@components/Survey/ImprovementCard';
import { StackedBar, StackedBarLegend } from '@components/Survey/StackedBar';
import SurveySection from '@components/Survey/SurveySection';
import SurveyTable from '@components/Survey/SurveyTable';
import TrendBarChart from '@components/Survey/TrendBarChart';
import {
  FORBEDRINGSFORSLAG,
  KOMMUNIKASJON,
  KONKLUSJON,
  KVALITATIVE,
  NOKKELTALL,
  OPPSUMMERING,
  RESPONDENTPROFIL,
  RESPONDENTS_2025,
  SECTION_NAV,
  TILFREDSHET,
  TRENDER,
  VERDI_IMPACT,
} from '@components/Survey/surveyData';

import './brukerundersokelse.scss';

const KONKLUSJON_COLORS = ['green', 'yellow', 'pink'] as const;

const Brukerundersokelse = () => {
  const { width } = useWindowDimensions();
  const [backgroundHeight, setBackgroundHeight] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const animatedCircleRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const _width = Math.floor((width ?? 0) / 100);

  useEffect(() => {
    const contentHeight = mainRef.current?.clientHeight ?? 0;
    setBackgroundHeight(contentHeight);
  }, [_width]);

  // Overlap detection – highlights animated line segments when the traveller dot passes over them
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion)',
    ).matches;
    if (prefersReducedMotion) return;

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

      animationFrameId.current = requestAnimationFrame(checkOverlap);
    };

    animationFrameId.current = requestAnimationFrame(checkOverlap);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const isLoaded = backgroundHeight > 0;

  return (
    <Contrast data-color-mode="contrast" className="undersokelse-wrapper">
      <SkipToContent>Hopp til hovedinnhold</SkipToContent>
      <TopNavigationLayout data-color-mode="contrast" />
      <div
        className="survey-page"
        style={
          {
            '--background-height': `${backgroundHeight}px`,
          } as React.CSSProperties
        }
      >
        <div className="survey-page__animation">
          <div
            ref={animatedCircleRef}
            className={classNames('survey-page__animation__traveller first', {
              'survey-page__animation__traveller--loaded': isLoaded,
            })}
          />
          <div
            className={classNames('survey-page__animation__traveller second', {
              'survey-page__animation__traveller--loaded': isLoaded,
            })}
          />
        </div>
        <LinjeTopographicBottom
          className={classNames('survey-bg-topographic-bottom', {
            'survey-bg-topographic-bottom--loaded': isLoaded,
          })}
        />
        <LinjeTopographicTop
          className={classNames('survey-bg-topographic-top', {
            'survey-bg-topographic-top--loaded': isLoaded,
          })}
        />
        <LinjeLines
          svgRef={svgRef}
          className={classNames('survey-bg-lines', {
            'survey-bg-lines--loaded': isLoaded,
          })}
        />

        <main ref={mainRef} className="survey-page__main" id="main-content">
          {/* Section navigation */}
          <nav className="survey-nav" aria-label="Seksjonsnavigasjon">
            {SECTION_NAV.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="survey-nav__link"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Hero */}
          <header className="survey-hero">
            <IconButton
              as={Link}
              to="/ressurser/"
              aria-label="Tilbake til ressurser"
              className="survey-hero__back"
            >
              <BackArrowIcon />
              Tilbake til ressurser
            </IconButton>
            <h1 className="survey-hero__title">
              Designsystemets brukerundersøkelser
            </h1>
            <p className="survey-hero__subtitle">
              Analyse av brukerundersøkelser for Entur Linje designsystem
              2022–2025.
            </p>
            <p className="survey-hero__subtitle">
              116 respondenter over fire år.
            </p>
          </header>

          {/* Nøkkeltall */}
          <div className="nokkeltall">
            {NOKKELTALL.map(card => (
              <DataCard key={card.label} {...card} />
            ))}
          </div>

          {/* 1. Oppsummering */}
          <SurveySection number="1" title="Oppsummering">
            <div className="oppsummering">
              <div className="oppsummering__column oppsummering__column--styrker">
                <LikeIcon className="oppsummering__icon" size={28} />
                <h3 className="oppsummering__heading">
                  Styrker (konsistente over alle 4 år)
                </h3>
                <div className="oppsummering__list">
                  {OPPSUMMERING.styrker.map((item, i) => (
                    <div className="oppsummering__item" key={i}>
                      <strong className="oppsummering__item-heading">
                        {item.heading}
                      </strong>
                      <span className="oppsummering__item-text">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="oppsummering__column oppsummering__column--forbedringsomrader">
                <ConfigurationIcon className="oppsummering__icon" size={28} />
                <h3 className="oppsummering__heading">
                  Forbedringsområder (gjentatt over flere år)
                </h3>
                <div className="oppsummering__list">
                  {OPPSUMMERING.forbedringsomrader.map((item, i) => (
                    <div className="oppsummering__item" key={i}>
                      <strong className="oppsummering__item-heading">
                        {item.heading}
                      </strong>
                      <span className="oppsummering__item-text">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SurveySection>

          {/* 2. Respondentprofil */}
          <SurveySection
            number="2"
            title="Respondentprofil"
            subtitle="4-års utvikling og detaljert 2025-profil (n=47)"
            className="survey-section--respondenter"
            id="respondenter"
          >
            <div className="respondent-cards">
              {RESPONDENTPROFIL.yearCards.map(card => (
                <DataCard
                  key={card.year}
                  value={String(card.count)}
                  label={card.year}
                  sublabel={card.breakdown}
                  small
                  className="data-card--left-aligned"
                  labelFirst
                />
              ))}
            </div>
            <div className="charts-grid">
              <div className="survey-card">
                <HorizontalBarChart
                  title={RESPONDENTPROFIL.roller.title}
                  data={RESPONDENTPROFIL.roller.data}
                />
              </div>
              <div className="survey-card">
                <HorizontalBarChart
                  title={RESPONDENTPROFIL.primaryUsers.title}
                  data={RESPONDENTPROFIL.primaryUsers.data}
                />
              </div>
            </div>
            <p className="respondent-interpretation">
              {RESPONDENTPROFIL.tolkning}
            </p>
          </SurveySection>

          {/* 3. Tilfredshet med designsystemets deler */}
          <SurveySection
            number="3"
            title="Tilfredshet med designsystemets deler"
            subtitle="2025-data med stacked satisfaction bars. Kun aktive brukere."
            id="tilfredshet"
          >
            <div className="tilfredshet-bars-card">
              {TILFREDSHET.items.map(item => (
                <StackedBar key={item.label} item={item} />
              ))}
              <StackedBarLegend labels={TILFREDSHET.legend} />
              <p className="survey-note survey-note--flush">
                Kun respondenter som bruker delen aktivt. «Bruker ikke» er
                ekskludert fra score.
              </p>
            </div>

            <div className="tilfredshet-bottom">
              <div
                className="distribution"
                role="img"
                aria-label={`Totaltilfredshet 2025 – Fordeling. ${TILFREDSHET.distribution
                  .map(d => `${d.label} stjerner: ${d.count} (${d.percent})`)
                  .join(', ')}`}
              >
                <h4 className="distribution__title" aria-hidden="true">
                  Totaltilfredshet 2025 – Fordeling (1–5 skala)
                </h4>
                {(() => {
                  const maxCount = Math.max(
                    ...TILFREDSHET.distribution.map(x => x.count),
                  );
                  return TILFREDSHET.distribution.map(d => (
                    <div
                      className="distribution__row"
                      key={d.label}
                      aria-hidden="true"
                    >
                      <span className="distribution__label">
                        {Array.from({ length: Number(d.label) }, (_, j) => (
                          <StarredIcon key={j} inline size={16} />
                        ))}{' '}
                        ({d.label})
                      </span>
                      <div className="distribution__track">
                        <div
                          className="distribution__fill"
                          style={{
                            width:
                              maxCount > 0
                                ? `${(d.count / maxCount) * 100}%`
                                : '0%',
                            background: d.color,
                          }}
                        >
                          {d.count > 0 && (
                            <span className="distribution__fill-value">
                              {d.count}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="distribution__percent">{d.percent}</span>
                    </div>
                  ));
                })()}
              </div>

              <div
                className="total-score"
                aria-label={`Totalscore: ${TILFREDSHET.totalScore.value} ${
                  TILFREDSHET.totalScore.subtitle
                }. ${TILFREDSHET.totalScore.details.join(' ')}`}
              >
                <span className="total-score__big" aria-hidden="true">
                  {TILFREDSHET.totalScore.value}
                </span>
                <div className="total-score__meta">
                  <span className="total-score__subtitle">
                    {TILFREDSHET.totalScore.subtitle}
                  </span>
                  {TILFREDSHET.totalScore.details.map((d, i) => (
                    <span className="total-score__detail" key={i}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SurveySection>

          {/* 4. 4-års trender */}
          <SurveySection
            number="4"
            title="4-års trender"
            subtitle="Nøkkelmetrikker og komponenttilfredshet over tid"
            id="trender"
          >
            <TrendBarChart
              title={TRENDER.overordnet.title}
              years={TRENDER.overordnet.years}
              values={TRENDER.overordnet.values}
              maxValue={5}
            />

            <div className="charts-grid">
              <TrendBarChart
                title={TRENDER.tidsbesparelse.title}
                years={TRENDER.tidsbesparelse.years}
                values={TRENDER.tidsbesparelse.values}
                maxValue={100}
                isPercent
              />
              <TrendBarChart
                title={TRENDER.visuellKonsistens.title}
                years={TRENDER.visuellKonsistens.years}
                values={TRENDER.visuellKonsistens.values}
                maxValue={100}
                isPercent
              />
            </div>

            <SurveyTable
              title={TRENDER.komponentTilfredshet.title}
              headers={TRENDER.komponentTilfredshet.headers}
              rows={TRENDER.komponentTilfredshet.rows}
            />
          </SurveySection>

          {/* 5. Verdi & Impact */}
          <SurveySection
            number="5"
            title="Verdi & Impact"
            subtitle="2025-resultater med 4-års kontekst"
            id="verdi"
          >
            <div className="verdi-grid">
              <div className="survey-card">
                <HorizontalBarChart
                  title={VERDI_IMPACT.sparerTid.title}
                  data={VERDI_IMPACT.sparerTid.data}
                  maxValue={RESPONDENTS_2025}
                />
              </div>
              <div className="survey-card">
                <h4 className="bar-chart__title">
                  {VERDI_IMPACT.hvaSparerTid.title}
                </h4>
                <div className="time-savings-list">
                  {VERDI_IMPACT.hvaSparerTid.data.map((item, i) => (
                    <div className="time-savings-list__item" key={i}>
                      <span className="time-savings-list__count">
                        {item.count}
                      </span>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="survey-card">
                <HorizontalBarChart
                  title={VERDI_IMPACT.bedreProdukter.title}
                  data={VERDI_IMPACT.bedreProdukter.data}
                  maxValue={RESPONDENTS_2025}
                />
              </div>
              <div className="survey-card">
                <HorizontalBarChart
                  title={VERDI_IMPACT.visuellKonsistens.title}
                  data={VERDI_IMPACT.visuellKonsistens.data}
                  maxValue={RESPONDENTS_2025}
                />
              </div>
            </div>
          </SurveySection>

          {/* 6. Kommunikasjon & Kontakt */}
          <SurveySection
            number="6"
            title="Kommunikasjon & Kontakt"
            id="kommunikasjon"
          >
            <div className="survey-grid">
              <div className="survey-card">
                <HorizontalBarChart
                  title={KOMMUNIKASJON.oppdateringer.title}
                  data={KOMMUNIKASJON.oppdateringer.data}
                  maxValue={RESPONDENTS_2025}
                />
                <p className="trend-note">
                  {KOMMUNIKASJON.oppdateringer.trend}
                </p>
              </div>
              <div className="survey-card">
                <HorizontalBarChart
                  title={KOMMUNIKASJON.kanaler.title}
                  data={KOMMUNIKASJON.kanaler.data}
                />
                <p className="trend-note">{KOMMUNIKASJON.kanaler.trend}</p>
              </div>
            </div>

            <div className="survey-grid">
              <div className="survey-card">
                <h3 className="survey-subsection__title">
                  {KOMMUNIKASJON.kontakt.title}
                </h3>
                <div className="contact-split">
                  <div className="contact-split__item">
                    <span className="contact-split__percent contact-split__percent--jungle">
                      {KOMMUNIKASJON.kontakt.ja.percent}
                    </span>
                    <span className="contact-split__label">
                      Ja ({KOMMUNIKASJON.kontakt.ja.count})
                    </span>
                  </div>
                  <div className="contact-split__item">
                    <span className="contact-split__percent contact-split__percent--coral">
                      {KOMMUNIKASJON.kontakt.nei.percent}
                    </span>
                    <span className="contact-split__label">
                      Nei ({KOMMUNIKASJON.kontakt.nei.count})
                    </span>
                  </div>
                </div>
                <p className="trend-note">{KOMMUNIKASJON.kontakt.nytte}</p>
                <p className="trend-note">{KOMMUNIKASJON.kontakt.trend}</p>
              </div>
              <div className="survey-card">
                <HorizontalBarChart
                  title={KOMMUNIKASJON.bidrag.title}
                  data={KOMMUNIKASJON.bidrag.data}
                  maxValue={RESPONDENTS_2025}
                />
                <p className="trend-note">{KOMMUNIKASJON.bidrag.trend}</p>
              </div>
            </div>

            <div className="survey-card">
              <HorizontalBarChart
                title={KOMMUNIKASJON.onboarding.title}
                data={KOMMUNIKASJON.onboarding.data}
              />
            </div>
          </SurveySection>

          {/* 7. Kvalitative tilbakemeldinger */}
          <SurveySection
            number="7"
            title="Kvalitative tilbakemeldinger"
            subtitle="Fritekst-svar fra alle 4 år"
            id="kvalitativt"
          >
            <FeedbackQuotes
              title={KVALITATIVE.fungerBra.title}
              quotes={KVALITATIVE.fungerBra.quotes}
            />
            <div className="survey-section-gap">
              <FeedbackIssues
                title={KVALITATIVE.fungerIkke.title}
                issues={KVALITATIVE.fungerIkke.issues}
              />
            </div>
          </SurveySection>

          {/* 8. Topp forbedringsforslag */}
          <SurveySection
            number="8"
            title="Topp forbedringsforslag"
            subtitle="Prioriterte tiltak basert på 4 års data"
            id="forslag"
          >
            {FORBEDRINGSFORSLAG.map(item => (
              <ImprovementCard key={item.number} item={item} />
            ))}
          </SurveySection>

          {/* 9. Konklusjon */}
          <SurveySection number="9" title="Konklusjon">
            <div className="konklusjon-grid">
              {KONKLUSJON.map((item, i) => (
                <div className="konklusjon-card" key={i}>
                  <h4
                    className={`konklusjon-card__title konklusjon-card__title--${KONKLUSJON_COLORS[i]}`}
                  >
                    {item.title}
                  </h4>
                  <p className="konklusjon-card__description">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </SurveySection>
        </main>
      </div>
    </Contrast>
  );
};

export default Brukerundersokelse;

export const Head = () => {
  return <SEO title="Brukerundersøkelse" />;
};
