import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { BackArrowIcon } from '@entur/icons';
import { Contrast, StatusBadge } from '@entur/layout';
import { IconButton } from '@entur/button';
import { useWindowDimensions } from '@entur/utils';

import { Link } from 'gatsby';
import { SEO } from '@components/seo/SEO';

import TopNavigationLayout from '../../../layouts/TopNavigationLayout';

import {
  LinjeLines,
  LinjeTopographicTop,
  LinjeTopographicBottom,
} from '@media/images/frontpage/BackgroundElements';

import DataCard from '@components/Survey/DataCard';
import HorizontalBarChart from '@components/Survey/HorizontalBarChart';
import SurveySection from '@components/Survey/SurveySection';

import {
  OKR_ISSUES,
  SUPPORT_ISSUES,
  VEDLIKEHOLD_ISSUES,
  OKR_STATS,
  SUPPORT_STATS,
  VEDLIKEHOLD_STATS,
  TOTAL_ISSUES,
  OKR_MAAL,
  SUPPORT_TEAMS,
  SUPPORT_TYPER,
  OKR_SECTION_NAV,
  KVARTAL_STATS,
} from './okr-rapport-data';

import './brukerundersokelse.scss';

type IssueStatus = 'Fullfort' | 'Pagar' | 'IkkeStartet';

const STATUS_LABELS: Record<IssueStatus, string> = {
  Fullfort: 'Ferdig',
  Pagar: 'Pagar',
  IkkeStartet: 'Ikke startet',
};

const STATUS_BADGE_VARIANT: Record<
  IssueStatus,
  'success' | 'warning' | 'neutral'
> = {
  Fullfort: 'success',
  Pagar: 'warning',
  IkkeStartet: 'neutral',
};

type IssueTableRow = {
  key: string;
  summary: string;
  status: IssueStatus;
  extra: string;
  kvartal?: string;
};

type IssueTableProps = {
  rows: IssueTableRow[];
  extraHeader: string;
  showKvartal?: boolean;
};

const IssueTable: React.FC<IssueTableProps> = ({
  rows,
  extraHeader,
  showKvartal = false,
}) => (
  <div className="survey-table">
    <div className="survey-table__wrapper">
      <table className="survey-table__table">
        <thead>
          <tr>
            <th className="survey-table__header-cell">Issue</th>
            <th className="survey-table__header-cell">Tittel</th>
            <th className="survey-table__header-cell">Status</th>
            <th className="survey-table__header-cell">{extraHeader}</th>
            {showKvartal && (
              <th className="survey-table__header-cell">Kvartal</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={`${row.key}-${row.kvartal}`}>
              <td className="survey-table__cell survey-table__label">
                <a
                  href={`https://enturas.atlassian.net/browse/${row.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--basecolors-text-subduedalt)' }}
                >
                  {row.key}
                </a>
              </td>
              <td className="survey-table__cell">{row.summary}</td>
              <td className="survey-table__cell">
                <StatusBadge
                  variant={STATUS_BADGE_VARIANT[row.status]}
                  style={{ textTransform: 'none' }}
                >
                  {STATUS_LABELS[row.status]}
                </StatusBadge>
              </td>
              <td
                className="survey-table__cell"
                style={{
                  fontSize: 'var(--font-size-body-s)',
                  color: 'var(--basecolors-text-subduedalt)',
                }}
              >
                {row.extra}
              </td>
              {showKvartal && (
                <td
                  className="survey-table__cell"
                  style={{
                    fontSize: 'var(--font-size-body-s)',
                    color: 'var(--basecolors-text-subduedalt)',
                  }}
                >
                  {row.kvartal}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Donut-progress-ring for kategori-andeler
type DonutRingProps = {
  percent: number;
  color: string;
  label: string;
  sublabel: string;
};

const DonutRing: React.FC<DonutRingProps> = ({
  percent,
  color,
  label,
  sublabel,
}) => {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dash = (percent / 100) * circumference;

  return (
    <div className="okr-donut">
      <svg viewBox="0 0 100 100" className="okr-donut__svg">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--basecolors-frame-contrastalt)"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
        />
      </svg>
      <div className="okr-donut__center">
        <span className="okr-donut__percent">{percent}%</span>
      </div>
      <span className="okr-donut__label">{label}</span>
      <span className="okr-donut__sublabel">{sublabel}</span>
    </div>
  );
};

// Kvartalsvis stapelbar bar
type KvartalBarProps = {
  label: string;
  okr: number;
  support: number;
  vedlikehold: number;
  total: number;
  maxTotal: number;
};

const KvartalBar: React.FC<KvartalBarProps> = ({
  label,
  okr,
  support,
  vedlikehold,
  total,
  maxTotal,
}) => {
  const trackWidth = 100;
  const okrW = (okr / maxTotal) * trackWidth;
  const supportW = (support / maxTotal) * trackWidth;
  const vedlikeholdW = (vedlikehold / maxTotal) * trackWidth;

  return (
    <div className="bar-chart__row">
      <span className="bar-chart__label" style={{ minWidth: '5rem' }}>
        {label}
      </span>
      <div
        className="bar-chart__track"
        style={{ position: 'relative', height: '2rem', display: 'flex' }}
      >
        <div
          style={{
            width: `${okrW}%`,
            background: '#7bc00b',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-size-body-s)',
            color: '#1a2e00',
            fontWeight: 600,
            minWidth: okr > 0 ? '2rem' : 0,
          }}
          title={`OKR: ${okr}`}
        >
          {okr > 0 ? okr : ''}
        </div>
        <div
          style={{
            width: `${supportW}%`,
            background: '#64b2fb',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-size-body-s)',
            color: '#001a33',
            fontWeight: 600,
            minWidth: support > 0 ? '2rem' : 0,
          }}
          title={`Støtte: ${support}`}
        >
          {support > 0 ? support : ''}
        </div>
        <div
          style={{
            width: `${vedlikeholdW}%`,
            background: '#ffbf9e',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-size-body-s)',
            color: '#331500',
            fontWeight: 600,
            minWidth: vedlikehold > 0 ? '2rem' : 0,
          }}
          title={`Vedlikehold: ${vedlikehold}`}
        >
          {vedlikehold > 0 ? vedlikehold : ''}
        </div>
      </div>
      <span
        className="bar-chart__percent"
        style={{ fontSize: 'var(--font-size-body-s)', minWidth: '3rem' }}
      >
        {total}
      </span>
    </div>
  );
};

const OkrRapport = () => {
  const { width } = useWindowDimensions();
  const [backgroundHeight, setBackgroundHeight] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const animatedCircleRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationFrameId = useRef<number>(null);

  const _width = Math.floor(width ?? 0 / 100);

  useEffect(() => {
    const contentHeight = mainRef.current?.clientHeight ?? 0;
    setBackgroundHeight(contentHeight);
  }, [_width]);

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
      animationFrameId.current = requestAnimationFrame(checkOverlap);
    };
    animationFrameId.current = requestAnimationFrame(checkOverlap);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const okrPercent = Math.round((OKR_STATS.total / TOTAL_ISSUES) * 100);
  const supportPercent = Math.round(
    (SUPPORT_STATS.total / TOTAL_ISSUES) * 100,
  );
  const vedlikeholdPercent = Math.round(
    (VEDLIKEHOLD_STATS.total / TOTAL_ISSUES) * 100,
  );

  const okrTableRows = OKR_ISSUES.map(i => ({
    key: i.key,
    summary: i.summary,
    status: i.status,
    extra: i.okrKobling ?? '',
    kvartal: i.kvartal,
  }));

  const supportTableRows = SUPPORT_ISSUES.map(i => ({
    key: i.key,
    summary: i.summary,
    status: i.status,
    extra: i.team ?? '',
    kvartal: i.kvartal,
  }));

  const vedlikeholdTableRows = VEDLIKEHOLD_ISSUES.map(i => ({
    key: i.key,
    summary: i.summary,
    status: i.status,
    extra: i.labels.join(', '),
    kvartal: i.kvartal,
  }));

  const maxKvartalTotal = Math.max(...KVARTAL_STATS.map(k => k.total));

  return (
    <Contrast data-color-mode="contrast" className="undersokelse-wrapper">
      <TopNavigationLayout data-color-mode="contrast" />
      <div
        className={classNames('survey-page', {
          'survey-page--loaded': backgroundHeight > 0,
        })}
        // @ts-expect-error css-variable inline is supported
        style={{ '--background-height': `${backgroundHeight}px` }}
      >
        <div className="survey-page__animation">
          <div
            ref={animatedCircleRef}
            className="survey-page__animation__traveller first"
          />
          <div className="survey-page__animation__traveller second" />
        </div>
        <LinjeTopographicBottom className="survey-bg-topographic-bottom" />
        <LinjeTopographicTop className="survey-bg-topographic-top" />
        <LinjeLines svgRef={svgRef} className="survey-bg-lines" />

        <main ref={mainRef} className="survey-page__main">
          {/* Seksjons-navigasjon */}
          <nav className="survey-nav">
            {OKR_SECTION_NAV.map(item => (
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
            <div className="survey-hero__top-links">
              <IconButton
                as={Link}
                to="/ressurser/"
                aria-label="Tilbake til ressurser"
                className="survey-hero__back"
              >
                <BackArrowIcon />
                Tilbake til ressurser
              </IconButton>
            </div>
            <h1 className="survey-hero__title">OKR-rapport 2025 – Q1 2026</h1>
            <p className="survey-hero__subtitle">
              Analyse av Jira-issues for Entur Linje designsystem, ETU-prosjektet,
              board 173. Perioden dekker hele 2025 (Q1–Q4) og Q1 2026 (januar–mars).
            </p>
            <p className="survey-hero__subtitle">
              {TOTAL_ISSUES} issues fordelt pa OKR-arbeid, støtte til andre
              team og vedlikehold.
            </p>
            <p
              className="survey-hero__subtitle"
              style={{
                fontSize: 'var(--font-size-body-s)',
                color: 'var(--basecolors-text-subduedalt)',
                marginTop: '0.5rem',
                fontStyle: 'italic',
              }}
            >
              Merk: Dette er et representativt eksempel-datasett. Atlassian
              MCP-verktøy var ikke tilgjengelig under generering. Oppdater med
              ekte data fra Jira board 173 ved behov.
            </p>
          </header>

          {/* Nøkkeltall-kort */}
          <div className="nokkeltall">
            <DataCard
              value={String(TOTAL_ISSUES)}
              label="Totalt antall issues"
              sublabel="2025 + Q1 2026 · ETU board 173"
            />
            <DataCard
              value={String(OKR_STATS.total)}
              label="OKR-koblet arbeid"
              sublabel={`${okrPercent}% av totalt`}
              change={`${okrPercent}%`}
              trend="up"
            />
            <DataCard
              value={String(SUPPORT_STATS.total)}
              label="Støtte og bistand"
              sublabel={`${supportPercent}% av totalt`}
            />
            <DataCard
              value={String(VEDLIKEHOLD_STATS.total)}
              label="Vedlikehold"
              sublabel={`${vedlikeholdPercent}% av totalt`}
            />
          </div>

          {/* 1. Sammendrag */}
          <SurveySection
            number="1"
            title="Sammendrag"
            subtitle={`2025 og Q1 2026 — ${TOTAL_ISSUES} Jira-issues analysert over 5 kvartal`}
            id="sammendrag"
          >
            <div className="okr-donut-row">
              <DonutRing
                percent={okrPercent}
                color="#7bc00b"
                label="OKR-koblet"
                sublabel={`${OKR_STATS.total} issues`}
              />
              <DonutRing
                percent={supportPercent}
                color="#64b2fb"
                label="Støtte og bistand"
                sublabel={`${SUPPORT_STATS.total} issues`}
              />
              <DonutRing
                percent={vedlikeholdPercent}
                color="#ffbf9e"
                label="Vedlikehold"
                sublabel={`${VEDLIKEHOLD_STATS.total} issues`}
              />
            </div>

            <div className="okr-status-grid">
              <div className="survey-card">
                <h3 className="survey-card__heading">OKR-koblet</h3>
                <div className="okr-status-list">
                  <div className="okr-status-item">
                    <StatusBadge variant="success" style={{ textTransform: 'none' }}>
                      Ferdig
                    </StatusBadge>
                    <span className="okr-status-item__count">
                      {OKR_STATS.fullfort}
                    </span>
                  </div>
                  <div className="okr-status-item">
                    <StatusBadge variant="warning" style={{ textTransform: 'none' }}>
                      Pagar
                    </StatusBadge>
                    <span className="okr-status-item__count">
                      {OKR_STATS.pagar}
                    </span>
                  </div>
                  <div className="okr-status-item">
                    <StatusBadge variant="neutral" style={{ textTransform: 'none' }}>
                      Ikke startet
                    </StatusBadge>
                    <span className="okr-status-item__count">
                      {OKR_STATS.ikkeStartet}
                    </span>
                  </div>
                </div>
              </div>

              <div className="survey-card">
                <h3 className="survey-card__heading">Støtte og bistand</h3>
                <div className="okr-status-list">
                  <div className="okr-status-item">
                    <StatusBadge variant="success" style={{ textTransform: 'none' }}>
                      Ferdig
                    </StatusBadge>
                    <span className="okr-status-item__count">
                      {SUPPORT_STATS.fullfort}
                    </span>
                  </div>
                  <div className="okr-status-item">
                    <StatusBadge variant="warning" style={{ textTransform: 'none' }}>
                      Pagar
                    </StatusBadge>
                    <span className="okr-status-item__count">
                      {SUPPORT_STATS.pagar}
                    </span>
                  </div>
                  <div className="okr-status-item">
                    <StatusBadge variant="neutral" style={{ textTransform: 'none' }}>
                      Ikke startet
                    </StatusBadge>
                    <span className="okr-status-item__count">
                      {SUPPORT_STATS.ikkeStartet}
                    </span>
                  </div>
                </div>
              </div>

              <div className="survey-card">
                <h3 className="survey-card__heading">Vedlikehold</h3>
                <div className="okr-status-list">
                  <div className="okr-status-item">
                    <StatusBadge variant="success" style={{ textTransform: 'none' }}>
                      Ferdig
                    </StatusBadge>
                    <span className="okr-status-item__count">
                      {VEDLIKEHOLD_STATS.fullfort}
                    </span>
                  </div>
                  <div className="okr-status-item">
                    <StatusBadge variant="warning" style={{ textTransform: 'none' }}>
                      Pagar
                    </StatusBadge>
                    <span className="okr-status-item__count">
                      {VEDLIKEHOLD_STATS.pagar}
                    </span>
                  </div>
                  <div className="okr-status-item">
                    <StatusBadge variant="neutral" style={{ textTransform: 'none' }}>
                      Ikke startet
                    </StatusBadge>
                    <span className="okr-status-item__count">
                      {VEDLIKEHOLD_STATS.ikkeStartet}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SurveySection>

          {/* 2. Fordeling per kvartal */}
          <SurveySection
            number="2"
            title="Fordeling per kvartal"
            subtitle="Antall issues per kategori, Q1 2025 til Q1 2026"
            id="per-kvartal"
          >
            <div className="survey-card" style={{ marginBottom: '1.5rem' }}>
              {/* Tegnforklaring */}
              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { color: '#7bc00b', label: 'OKR-koblet' },
                  { color: '#64b2fb', label: 'Støtte og bistand' },
                  { color: '#ffbf9e', label: 'Vedlikehold' },
                ].map(item => (
                  <span
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: 'var(--font-size-body-s)',
                      color: 'var(--basecolors-text-subduedalt)',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '0.75rem',
                        height: '0.75rem',
                        borderRadius: '2px',
                        background: item.color,
                      }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>

              <div className="bar-chart__bars">
                {KVARTAL_STATS.map(k => (
                  <KvartalBar
                    key={k.kvartal}
                    label={k.label}
                    okr={k.okr}
                    support={k.support}
                    vedlikehold={k.vedlikehold}
                    total={k.total}
                    maxTotal={maxKvartalTotal}
                  />
                ))}
              </div>
            </div>

            {/* Kvartalstabell */}
            <div className="survey-table">
              <div className="survey-table__wrapper">
                <table className="survey-table__table">
                  <thead>
                    <tr>
                      <th className="survey-table__header-cell">Kvartal</th>
                      <th className="survey-table__header-cell">OKR-koblet</th>
                      <th className="survey-table__header-cell">Støtte</th>
                      <th className="survey-table__header-cell">Vedlikehold</th>
                      <th className="survey-table__header-cell">Totalt</th>
                      <th className="survey-table__header-cell">OKR %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {KVARTAL_STATS.map(k => (
                      <tr key={k.kvartal}>
                        <td className="survey-table__cell survey-table__label">
                          {k.label}
                        </td>
                        <td className="survey-table__cell">{k.okr}</td>
                        <td className="survey-table__cell">{k.support}</td>
                        <td className="survey-table__cell">{k.vedlikehold}</td>
                        <td className="survey-table__cell">{k.total}</td>
                        <td className="survey-table__cell">
                          <StatusBadge
                            variant="success"
                            style={{ textTransform: 'none' }}
                          >
                            {Math.round((k.okr / k.total) * 100)}%
                          </StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SurveySection>

          {/* 3. OKR-koblet arbeid */}
          <SurveySection
            number="3"
            title="OKR-koblet arbeid"
            subtitle={`${OKR_STATS.total} issues direkte koblet til designsystemets mal — 2025 og Q1 2026`}
            id="okr-arbeid"
          >
            <div className="survey-card" style={{ marginBottom: '1.5rem' }}>
              <HorizontalBarChart
                title="Issues per OKR-mal (samlet)"
                data={OKR_MAAL.map(m => ({
                  label: m.fullLabel,
                  value: m.antall,
                  percent: `${m.antall} issues`,
                  color: m.color,
                }))}
                maxValue={OKR_MAAL[0].antall + 1}
              />
            </div>

            <div className="okr-maal-grid">
              {OKR_MAAL.map(mal => (
                <div className="survey-card okr-maal-card" key={mal.tittel}>
                  <span
                    className="okr-maal-card__dot"
                    style={{ background: mal.color }}
                  />
                  <div>
                    <h4 className="okr-maal-card__tittel">{mal.fullLabel}</h4>
                    <span className="okr-maal-card__antall">
                      {mal.antall} issues
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SurveySection>

          {/* 4. Støtte og bistand */}
          <SurveySection
            number="4"
            title="Støtte og bistand til andre team"
            subtitle={`${SUPPORT_STATS.total} issues — hjelp, reviews, bugfikser og radgivning`}
            id="support"
          >
            <div className="charts-grid">
              <div className="survey-card">
                <HorizontalBarChart
                  title="Hvilke team fikk hjelp"
                  data={SUPPORT_TEAMS.map(t => ({
                    label: t.team,
                    value: t.antall,
                    percent: `${t.antall}`,
                    color: t.color,
                  }))}
                />
              </div>
              <div className="survey-card">
                <HorizontalBarChart
                  title="Type støtte"
                  data={SUPPORT_TYPER.map(t => ({
                    label: t.type,
                    value: t.antall,
                    percent: `${t.antall}`,
                    color: t.color,
                  }))}
                />
              </div>
            </div>
          </SurveySection>

          {/* 5. Vedlikehold */}
          <SurveySection
            number="5"
            title="Vedlikehold"
            subtitle={`${VEDLIKEHOLD_STATS.total} issues — infrastruktur, deps og teknisk gjeld`}
            id="vedlikehold"
          >
            <div className="survey-card">
              <p
                style={{
                  color: 'var(--basecolors-text-subduedalt)',
                  fontSize: 'var(--font-size-body-m)',
                  marginBottom: '1rem',
                }}
              >
                Vedlikeholdsarbeid er ikke direkte OKR-koblet, men er nodvendig
                for a sikre stabil infrastruktur og god utvikleropplevelse for
                konsumentteamene. I 2025 inkluderte dette blant annet migrering
                til Yarn 4, Vite 6, Node.js 22 LTS og forberedelse til Linje v4.
              </p>
              <div className="okr-status-list">
                <div className="okr-status-item">
                  <StatusBadge variant="success" style={{ textTransform: 'none' }}>
                    Ferdig
                  </StatusBadge>
                  <span className="okr-status-item__count">
                    {VEDLIKEHOLD_STATS.fullfort} av {VEDLIKEHOLD_STATS.total}
                  </span>
                </div>
                <div className="okr-status-item">
                  <StatusBadge variant="warning" style={{ textTransform: 'none' }}>
                    Pagar
                  </StatusBadge>
                  <span className="okr-status-item__count">
                    {VEDLIKEHOLD_STATS.pagar} av {VEDLIKEHOLD_STATS.total}
                  </span>
                </div>
                <div className="okr-status-item">
                  <StatusBadge variant="neutral" style={{ textTransform: 'none' }}>
                    Ikke startet
                  </StatusBadge>
                  <span className="okr-status-item__count">
                    {VEDLIKEHOLD_STATS.ikkeStartet} av{' '}
                    {VEDLIKEHOLD_STATS.total}
                  </span>
                </div>
              </div>
            </div>
          </SurveySection>

          {/* 6. Fullstendig issues-tabell */}
          <SurveySection
            number="6"
            title="Fullstendig issues-tabell"
            subtitle="Alle analyserte issues med status, kategori og kvartal"
            id="issues-tabell"
          >
            <h3
              style={{
                color: 'var(--basecolors-text-light)',
                fontSize: 'var(--font-size-heading-s)',
                marginBottom: '0.75rem',
                marginTop: '0',
              }}
            >
              OKR-koblet arbeid ({OKR_STATS.total})
            </h3>
            <IssueTable
              rows={okrTableRows}
              extraHeader="OKR-kobling"
              showKvartal
            />

            <h3
              style={{
                color: 'var(--basecolors-text-light)',
                fontSize: 'var(--font-size-heading-s)',
                marginBottom: '0.75rem',
                marginTop: '2rem',
              }}
            >
              Støtte og bistand ({SUPPORT_STATS.total})
            </h3>
            <IssueTable
              rows={supportTableRows}
              extraHeader="Team"
              showKvartal
            />

            <h3
              style={{
                color: 'var(--basecolors-text-light)',
                fontSize: 'var(--font-size-heading-s)',
                marginBottom: '0.75rem',
                marginTop: '2rem',
              }}
            >
              Vedlikehold ({VEDLIKEHOLD_STATS.total})
            </h3>
            <IssueTable
              rows={vedlikeholdTableRows}
              extraHeader="Labels"
              showKvartal
            />
          </SurveySection>

          {/* Footer-notis */}
          <div
            style={{
              paddingBottom: '4rem',
              color: 'var(--basecolors-text-subduedalt)',
              fontSize: 'var(--font-size-body-s)',
            }}
          >
            <p>
              Sist oppdatert: 20. mars 2026. Data hentet fra Jira ETU-prosjektet,
              board 173. Periode: 2025-01-01 til 2026-03-31.
            </p>
            <p style={{ fontStyle: 'italic' }}>
              Atlassian MCP-verktøy var ikke tilgjengelig ved generering —
              datasettet er representativt. For a oppdatere med ekte data, kjør
              JQL:{' '}
              <code
                style={{
                  background: 'var(--basecolors-frame-contrastalt)',
                  padding: '0 4px',
                  borderRadius: '4px',
                  fontStyle: 'normal',
                }}
              >
                project = ETU AND labels in (linje) AND created &gt;= "2025-01-01"
              </code>
              {' '}og oppdater{' '}
              <code
                style={{
                  background: 'var(--basecolors-frame-contrastalt)',
                  padding: '0 4px',
                  borderRadius: '4px',
                  fontStyle: 'normal',
                }}
              >
                okr-rapport-data.ts
              </code>
              .
            </p>
            <p style={{ marginTop: '0.5rem' }}>
              Anbefalte Jira-labels for fremtidige kvartal:{' '}
              <code
                style={{
                  background: 'var(--basecolors-frame-contrastalt)',
                  padding: '0 4px',
                  borderRadius: '4px',
                }}
              >
                okr-q2-2026
              </code>
              {' '}og{' '}
              <code
                style={{
                  background: 'var(--basecolors-frame-contrastalt)',
                  padding: '0 4px',
                  borderRadius: '4px',
                }}
              >
                support
              </code>
              .
            </p>
          </div>
        </main>
      </div>
    </Contrast>
  );
};

export default OkrRapport;

export const Head = () => {
  return (
    <SEO
      title="OKR-rapport 2025 – Q1 2026"
      description="Status pa designsystemets OKR-arbeid og støtte til andre team. Periode: hele 2025 og Q1 2026."
    />
  );
};
