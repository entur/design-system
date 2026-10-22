import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { IconButton } from '@entur/button';
import { SegmentedChoice, SegmentedControl, Switch } from '@entur/form';
import { LeftArrowIcon, RightArrowIcon } from '@entur/icons';
import { ActionChip } from '@entur/chip';
import {
  BaseCard,
  NavigationCard,
  NotificationBadge,
  Tag,
} from '@entur/layout';
import { SideNavigation } from '@entur/menu/beta';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import {
  Heading,
  Label,
  Link,
  ListItem,
  NumberedList,
  Text,
  TextContainer,
  UnorderedList,
} from '@entur/typography/beta';
import {
  Blockquote as OldBlockquote,
  BlockquoteFooter as OldBlockquoteFooter,
  CodeText as OldCodeText,
  EmphasizedText as OldEmphasizedText,
  Heading1 as OldHeading1,
  Heading2 as OldHeading2,
  Heading3 as OldHeading3,
  Heading4 as OldHeading4,
  Heading5 as OldHeading5,
  Heading6 as OldHeading6,
  Label as OldLabel,
  LeadParagraph as OldLeadParagraph,
  Link as OldLink,
  ListItem as OldListItem,
  NumberedList as OldNumberedList,
  Paragraph as OldParagraph,
  PreformattedText as OldPreformattedText,
  SmallText as OldSmallText,
  SubLabel as OldSubLabel,
  SubParagraph as OldSubParagraph,
  UnorderedList as OldUnorderedList,
} from '@entur/typography';

import type { Owner, Swatch } from './content';
import {
  added,
  changed,
  decisions,
  figmaUpdates,
  figmaColors,
  figmaSpacingRenames,
  pullRequests,
  questions,
  remaining,
  removed,
} from './content';
import {
  ColorMode,
  Compare,
  Density,
  Gaps,
  ImagePlaceholder,
  WithGaps,
  Settings,
  SettingsContext,
  Spec,
  Stage,
} from './helpers';
import { FigmaArticle } from './FigmaArticle';
import { RhythmTable } from './RhythmTable';

import './TypographyReview.scss';

const ownerVariant: Record<Owner, 'lilac' | 'peach' | 'spring' | 'blue'> = {
  Design: 'lilac',
  Produkt: 'peach',
  'Design + produkt': 'spring',
  'Design + kode': 'blue',
};

type Topic = {
  id: string;
  title: string;
  headline: string;
  points?: string[];
  decisions?: string[];
  questions?: string[];
  render: (props: { scenario: string }) => React.ReactNode;
  scenarios?: string[];
};

const Article = () => (
  <Gaps as={TextContainer}>
    <Text variant="overline">Reiseinformasjon</Text>
    <Heading as="h1" variant="title-1">
      Slik reiser du med tog
    </Heading>
    <Text variant="leading">Alt du trenger før du går på toget.</Text>
    <Text>Kjøp billett i appen, på nettsiden eller i automaten.</Text>
    <Heading as="h2">Billetter</Heading>
    <Text>Du kan velge mellom:</Text>
    <UnorderedList>
      <ListItem>Enkeltbillett</ListItem>
      <ListItem>Periodebillett</ListItem>
    </UnorderedList>
    <Text>Barn under seks år reiser gratis.</Text>
    <Heading as="h3" variant="subtitle-1">
      Rabatter
    </Heading>
    <Heading as="h4" variant="subtitle-2">
      Studenter
    </Heading>
    <Text>Studenter får rabatt med gyldig studentbevis.</Text>
    <figure>
      <Text variant="quote">Husk studentbeviset.</Text>
      <Text as="figcaption" variant="caption">
        Eksempelkilde
      </Text>
    </figure>
    <Text>Les vilkårene før du reiser.</Text>
    <ImagePlaceholder />
    <Text variant="caption">Bildetekst rett under bildet.</Text>
  </Gaps>
);

const OldArticle = () => (
  <Gaps>
    <OldHeading1>Slik reiser du med tog</OldHeading1>
    <OldLeadParagraph>Alt du trenger før du går på toget.</OldLeadParagraph>
    <OldParagraph>
      Kjøp billett i appen, på nettsiden eller i automaten.
    </OldParagraph>
    <OldHeading2>Billetter</OldHeading2>
    <OldParagraph>Du kan velge mellom:</OldParagraph>
    <OldUnorderedList>
      <OldListItem>Enkeltbillett</OldListItem>
      <OldListItem>Periodebillett</OldListItem>
    </OldUnorderedList>
    <OldParagraph>Barn under seks år reiser gratis.</OldParagraph>
    <OldHeading3>Rabatter</OldHeading3>
    <OldHeading4>Studenter</OldHeading4>
    <OldParagraph>Studenter får rabatt med gyldig studentbevis.</OldParagraph>
    <OldBlockquote>
      Husk studentbeviset.
      <OldBlockquoteFooter>Eksempelkilde</OldBlockquoteFooter>
    </OldBlockquote>
    <OldParagraph>Les vilkårene før du reiser.</OldParagraph>
    <ImagePlaceholder />
    <OldSmallText>Bildetekst rett under bildet.</OldSmallText>
  </Gaps>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="typography-review__card-sample">{children}</div>
);

const topics: Topic[] = [
  {
    id: 'avstand',
    title: 'Avstand',
    headline: 'Ingen marger. TextContainer gir rytmen.',
    points: [
      'Tekst har ingen marger',
      'TextContainer rundt løpende tekst',
      'spacing for unntak, samme skala som gap',
      'Luft = etter forrige + før neste',
    ],
    decisions: ['B2', 'B3', 'B4', 'B5', 'B16', 'B23', 'B24'],
    questions: ['S1', 'S2'],
    scenarios: ['Artikkel', 'Kort', 'Alle mellomrom', 'Figma-artikkel'],
    render: ({ scenario }) =>
      scenario === 'Kort' ? (
        <WithGaps>
          <Compare
            today={
              <Card>
                <Gaps>
                  <OldHeading3>Periodebillett</OldHeading3>
                  <OldParagraph>Reis så mye du vil i 30 dager.</OldParagraph>
                </Gaps>
              </Card>
            }
            now={
              <Card>
                <Gaps>
                  <Heading
                    as="h3"
                    variant="subtitle-1"
                    spacing={{ bottom: 'xs' }}
                  >
                    Periodebillett
                  </Heading>
                  <Text>Reis så mye du vil i 30 dager.</Text>
                </Gaps>
              </Card>
            }
          />
        </WithGaps>
      ) : scenario === 'Alle mellomrom' ? (
        <RhythmTable />
      ) : scenario === 'Figma-artikkel' ? (
        <WithGaps>
          <FigmaArticle />
        </WithGaps>
      ) : (
        <WithGaps>
          <Compare today={<OldArticle />} now={<Article />} />
        </WithGaps>
      ),
  },
  {
    id: 'overskrifter',
    title: 'Overskrifter',
    headline: 'Én Heading. Variant er stil, as er nivå.',
    points: [
      'Heading1–6 → Heading',
      'Tettere linjehøyde',
      'h2 som standard',
      'size overstyrer variant',
      'Jevne linjeskift',
    ],
    decisions: ['B6', 'B19', 'B21'],
    questions: ['S10'],
    render: () => (
      <Compare
        today={
          <>
            <Spec name="Heading1">
              <OldHeading1 margin="none">Reis kollektivt</OldHeading1>
            </Spec>
            <Spec name="Heading2">
              <OldHeading2 margin="none">Reis kollektivt</OldHeading2>
            </Spec>
            <Spec name="Heading3">
              <OldHeading3 margin="none">Reis kollektivt</OldHeading3>
            </Spec>
            <Spec name="Heading4">
              <OldHeading4 margin="none">Reis kollektivt</OldHeading4>
            </Spec>
            <Spec name="Heading5">
              <OldHeading5 margin="none">Reis kollektivt</OldHeading5>
            </Spec>
            <Spec name="Heading6">
              <OldHeading6 margin="none">Reis kollektivt</OldHeading6>
            </Spec>
          </>
        }
        now={
          <>
            {(
              [
                'title-1',
                'title-2',
                'subtitle-1',
                'subtitle-2',
                'section-1',
                'section-2',
              ] as const
            ).map(variant => (
              <Spec key={variant} name={variant}>
                <Heading as="div" variant={variant}>
                  Reis kollektivt
                </Heading>
              </Spec>
            ))}
          </>
        }
      />
    ),
  },
  {
    id: 'tekst',
    title: 'Brødtekst',
    headline: 'Én Text med varianter.',
    points: [
      'Text uten variant = avsnitt',
      'caption, label … er <p>',
      'Label for skjemafelt',
      'Vekt: medium eller bold',
    ],
    decisions: ['B7', 'B9', 'B10', 'B20', 'B22'],
    questions: ['S9'],
    render: () => (
      <Compare
        today={
          <>
            <Spec name="LeadParagraph">
              <OldLeadParagraph margin="none">
                Reis kollektivt i hele Norge
              </OldLeadParagraph>
            </Spec>
            <Spec name="Paragraph">
              <OldParagraph margin="none">
                Reis kollektivt i hele Norge
              </OldParagraph>
            </Spec>
            <Spec name="SubParagraph">
              <OldSubParagraph margin="none">
                Reis kollektivt i hele Norge
              </OldSubParagraph>
            </Spec>
            <Spec name="SmallText">
              <OldSmallText margin="none">
                Reis kollektivt i hele Norge
              </OldSmallText>
            </Spec>
            <Spec name="Label">
              <OldLabel margin="none">Reis kollektivt i hele Norge</OldLabel>
            </Spec>
            <Spec name="SubLabel">
              <OldSubLabel margin="none">
                Reis kollektivt i hele Norge
              </OldSubLabel>
            </Spec>
            <Spec name="EmphasizedText">
              <OldEmphasizedText>
                Reis kollektivt i hele Norge
              </OldEmphasizedText>
            </Spec>
          </>
        }
        now={
          <>
            <Spec name="leading">
              <Text variant="leading">Reis kollektivt i hele Norge</Text>
            </Spec>
            <Spec name="Text (paragraph)">
              <Text>Reis kollektivt i hele Norge</Text>
            </Spec>
            <Spec name="subparagraph">
              <Text variant="subparagraph">Reis kollektivt i hele Norge</Text>
            </Spec>
            <Spec name="caption">
              <Text variant="caption">Reis kollektivt i hele Norge</Text>
            </Spec>
            <Spec name='tone="subdued"'>
              <Text variant="caption" tone="subdued">
                Oppdatert 21. oktober
              </Text>
            </Spec>
            <Spec name="Label / label">
              <Label>Reis kollektivt i hele Norge</Label>
            </Spec>
            <Spec name="sublabel">
              <Text variant="sublabel">Reis kollektivt i hele Norge</Text>
            </Spec>
            <Spec name="emphasized">
              <Text variant="emphasized">Reis kollektivt i hele Norge</Text>
            </Spec>
            <Spec name="overline">
              <Text variant="overline">Reis kollektivt i hele Norge</Text>
            </Spec>
          </>
        }
      />
    ),
  },
  {
    id: 'lenker',
    title: 'Lenker',
    headline: 'Tynn strek, sveip på hover, ikke ikon.',
    points: [
      'Strek under bokstavene',
      'Sveip av ved redusert bevegelse',
      'Ikke ikon for ekstern lenke',
      '«(åpnes i ny fane)» i teksten',
    ],
    decisions: ['B14', 'B15'],
    questions: ['S3', 'S4'],
    render: () => (
      <Compare
        today={
          <>
            <OldParagraph>
              Kjøp billett på <OldLink href="#lenker">entur.no</OldLink> eller
              les om{' '}
              <OldLink href="#lenker">
                reisevilkår og refusjon når toget er forsinket
              </OldLink>
              .
            </OldParagraph>
            <OldParagraph>
              Les mer på{' '}
              <OldLink
                href="https://www.regjeringen.no"
                external
                target="_blank"
                rel="noreferrer"
              >
                regjeringen.no
              </OldLink>
              .
            </OldParagraph>
            <OldHeading3>
              <OldLink href="#lenker">Priser og rabatter</OldLink>
            </OldHeading3>
          </>
        }
        now={
          <TextContainer>
            <Text>
              Kjøp billett på <Link href="#lenker">entur.no</Link> eller les om{' '}
              <Link href="#lenker">
                reisevilkår og refusjon når toget er forsinket
              </Link>
              .
            </Text>
            <Text>
              Les mer på{' '}
              <Link
                href="https://www.regjeringen.no"
                target="_blank"
                rel="noreferrer"
              >
                regjeringen.no (åpnes i ny fane)
              </Link>
              .
            </Text>
            <Heading as="h3" variant="subtitle-1">
              <Link href="#lenker">Priser og rabatter</Link>
            </Heading>
            <Text>
              <Link as="button" type="button">
                Vis flere avganger
              </Link>
            </Text>
          </TextContainer>
        }
      />
    ),
  },
  {
    id: 'kode',
    title: 'Kode',
    headline: 'Kode følger teksten rundt.',
    points: [
      '0,875em av teksten',
      'Fyll, ingen kant',
      'Brytes som tekst',
      'Monospace fra systemet',
    ],
    decisions: ['B11', 'B12'],
    questions: ['S5'],
    render: () => (
      <Compare
        today={
          <>
            <OldHeading3>
              Bruk <OldCodeText>TextContainer</OldCodeText>
            </OldHeading3>
            <OldParagraph>
              Sett <OldCodeText>spacing</OldCodeText> bare for unntak.
            </OldParagraph>
            <OldPreformattedText>
              {'Avgang:\t07.25\nSpor:\t4'}
            </OldPreformattedText>
          </>
        }
        now={
          <TextContainer>
            <Heading as="h3" variant="subtitle-1">
              Bruk <Text variant="code">TextContainer</Text>
            </Heading>
            <Text>
              Sett <Text variant="code">spacing</Text> bare for unntak.
            </Text>
            <Text variant="preformatted">{'Avgang:\t07.25\nSpor:\t4'}</Text>
          </TextContainer>
        }
      />
    ),
  },
  {
    id: 'lister',
    title: 'Lister',
    headline: 'Prikk, halvfete tall og ny steg-liste.',
    points: [
      'Prikk og ring',
      'Tall fra nettleseren',
      'Markører i tekstfarge',
      'Ny: variant="steps"',
    ],
    decisions: ['B13'],
    questions: ['S6', 'S7'],
    scenarios: ['Lister', 'Steg'],
    render: ({ scenario }) =>
      scenario === 'Steg' ? (
        <Compare
          now={
            <NumberedList variant="steps">
              <ListItem>Åpne appen</ListItem>
              <ListItem>
                Trykk på Billetter
                <NumberedList>
                  <ListItem>Nøstet liste får vanlige tall</ListItem>
                </NumberedList>
              </ListItem>
              <ListItem>Vis billetten til konduktøren</ListItem>
            </NumberedList>
          }
        />
      ) : (
        <Compare
          today={
            <>
              <OldUnorderedList>
                <OldListItem>Gyldig billett</OldListItem>
                <OldListItem>
                  Legitimasjon
                  <OldUnorderedList>
                    <OldListItem>Pass</OldListItem>
                  </OldUnorderedList>
                </OldListItem>
              </OldUnorderedList>
              <OldNumberedList>
                <OldListItem>Velg avreise</OldListItem>
                <OldListItem>Betal</OldListItem>
              </OldNumberedList>
            </>
          }
          now={
            <TextContainer>
              <UnorderedList>
                <ListItem>Gyldig billett</ListItem>
                <ListItem>
                  Legitimasjon
                  <UnorderedList>
                    <ListItem>Pass</ListItem>
                  </UnorderedList>
                </ListItem>
              </UnorderedList>
              <NumberedList>
                <ListItem>Velg avreise</ListItem>
                <ListItem>Betal</ListItem>
              </NumberedList>
            </TextContainer>
          }
        />
      ),
  },
  {
    id: 'sitat',
    title: 'Sitat',
    headline: 'Sitat er en variant, kilden en figcaption.',
    points: [
      'Blockquote → Text variant="quote"',
      'Kilde i figure + figcaption',
    ],
    decisions: ['B8'],
    render: () => (
      <Compare
        today={
          <OldBlockquote>
            Et sitat står for seg selv.
            <OldBlockquoteFooter>Eksempelkilde</OldBlockquoteFooter>
          </OldBlockquote>
        }
        now={
          <TextContainer>
            <figure>
              <Text variant="quote">Et sitat står for seg selv.</Text>
              <Text as="figcaption" variant="caption">
                Eksempelkilde
              </Text>
            </figure>
          </TextContainer>
        }
      />
    ),
  },
  {
    id: 'nytt',
    title: 'trim',
    headline: 'Tekst som flukter med ting ved siden av.',
    points: [
      'Av som standard',
      'Chrome, Safari og Firefox',
      'Ikke på tekst som kan kuttes',
    ],
    decisions: ['B25'],
    render: () => (
      <Compare
        now={
          <div className="typography-review__trim">
            <Heading as="div" variant="title-2">
              Uten
            </Heading>
            <Heading as="div" variant="title-2" trim>
              Med trim
            </Heading>
          </div>
        }
      />
    ),
  },
];

const Chips = ({
  ids,
  onOpen,
}: {
  ids?: string[];
  onOpen: (id: string) => void;
}) =>
  ids?.length ? (
    <span className="typography-review__chips">
      {ids.map(id => (
        <ActionChip
          key={id}
          size="small"
          onClick={() => onOpen(id)}
          title={
            questions.find(q => q.id === id)?.title ??
            decisions.find(d => d.id === id)?.title
          }
        >
          {id}
        </ActionChip>
      ))}
    </span>
  ) : null;

const pages = [
  { id: 'oversikt', title: 'Oversikt' },
  ...topics.map(t => ({ id: t.id, title: t.title })),
  { id: 'avklaring', title: 'Til avklaring' },
  { id: 'figma', title: 'Figma' },
  { id: 'endringer', title: 'Alle endringer' },
];

const readHash = () => {
  if (typeof window === 'undefined') return 'oversikt';
  const id = window.location.hash.replace('#', '');
  return pages.some(p => p.id === id) ? id : 'oversikt';
};

const SwatchLabel = ({ swatch }: { swatch: Swatch }) => (
  <span className="typography-review__swatch-label">
    <span
      className="typography-review__swatch"
      style={{ background: swatch.hex }}
      aria-hidden="true"
    />
    {swatch.name}
  </span>
);

/** Old colour → new colour, as swatches */
const ColorChange = ({ from, to }: { from?: Swatch; to: Swatch }) => (
  <span className="typography-review__swatch-label">
    {from && (
      <>
        <SwatchLabel swatch={from} /> →
      </>
    )}
    <SwatchLabel swatch={to} />
  </span>
);

const PageHeader = ({
  overline,
  title,
  children,
}: {
  overline?: string;
  title: string;
  children?: React.ReactNode;
}) => (
  <header className="typography-review__header">
    {overline && (
      <Text variant="overline" spacing={{ bottom: '2xs' }}>
        {overline}
      </Text>
    )}
    <Heading as="h1" variant="title-1">
      {title}
    </Heading>
    {children}
  </header>
);

export const TypographyReview = () => {
  const [page, setPage] = useState('oversikt');
  const [scenario, setScenario] = useState<Record<string, string>>({});
  const [highlight, setHighlight] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>({
    mode: 'standard',
    density: 'standard',
    gaps: false,
  });
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings(s => ({ ...s, [key]: value }));

  const go = useCallback((id: string) => {
    setPage(id);
    window.history.replaceState(null, '', `#${id}`);
    window.scrollTo({ top: 0 });
  }, []);

  const index = pages.findIndex(p => p.id === page);
  const step = useCallback(
    (delta: number) => {
      const next = pages[(index + delta + pages.length) % pages.length];
      go(next.id);
    },
    [index, go],
  );

  const open = (id: string) => {
    setHighlight(id);
    go(id.startsWith('S') ? 'avklaring' : 'endringer');
  };

  useEffect(() => {
    const onHash = () => setPage(readHash());
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      // Arrows belong to text fields and to the radio buttons in the segmented controls
      const target = event.target as HTMLElement;
      if (target.closest('textarea, input:not([type="checkbox"])')) return;
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const topic = topics.find(t => t.id === page);
  const topicScenario = topic?.scenarios
    ? scenario[topic.id] ?? topic.scenarios[0]
    : '';

  return (
    <SettingsContext.Provider value={settings}>
      <div className="typography-review">
        <nav className="typography-review__nav" aria-label="Tema">
          <Heading
            as="p"
            variant="subtitle-2"
            spacing={{ bottom: 's' }}
            className="typography-review__nav-title"
          >
            Ny typografi
          </Heading>
          <SideNavigation>
            {pages.map((p, i) => {
              const count = topics.find(t => t.id === p.id)?.questions?.length;
              return (
                <SideNavigation.Item
                  key={p.id}
                  as="button"
                  type="button"
                  active={p.id === page}
                  onClick={() => go(p.id)}
                  badge={
                    count ? (
                      <NotificationBadge variant="primary">
                        {count}
                      </NotificationBadge>
                    ) : undefined
                  }
                >
                  {i}. {p.title}
                </SideNavigation.Item>
              );
            })}
          </SideNavigation>
        </nav>

        <div className="typography-review__main">
          <div className="typography-review__toolbar">
            <div className="typography-review__pager">
              <IconButton aria-label="Forrige" onClick={() => step(-1)}>
                <LeftArrowIcon />
              </IconButton>
              <Text as="span" variant="subparagraph">
                {index} / {pages.length - 1}
              </Text>
              <IconButton aria-label="Neste" onClick={() => step(1)}>
                <RightArrowIcon />
              </IconButton>
            </div>
            <SegmentedControl
              label="Modus"
              value={settings.mode}
              onChange={v => set('mode', (v as ColorMode) ?? 'standard')}
            >
              <SegmentedChoice value="standard">Lys</SegmentedChoice>
              <SegmentedChoice value="contrast">Kontrast</SegmentedChoice>
              <SegmentedChoice value="dark">Mørk</SegmentedChoice>
            </SegmentedControl>
            <SegmentedControl
              label="Tetthet"
              value={settings.density}
              onChange={v => set('density', (v as Density) ?? 'standard')}
            >
              <SegmentedChoice value="compact">Kompakt</SegmentedChoice>
              <SegmentedChoice value="standard">Standard</SegmentedChoice>
              <SegmentedChoice value="display">Stor</SegmentedChoice>
            </SegmentedControl>
          </div>

          <main className="typography-review__content">
            {page === 'oversikt' && (
              <>
                <PageHeader title="Ny typografi">
                  <Text variant="leading">
                    {topics.length} tema · {decisions.length} beslutninger ·{' '}
                    {questions.length} spørsmål · {figmaUpdates.length + 3}{' '}
                    Figma-endringer
                  </Text>
                </PageHeader>
                <div className="typography-review__grid">
                  {topics.map((t, i) => (
                    <NavigationCard
                      key={t.id}
                      href={`#${t.id}`}
                      title={`${i + 1}. ${t.title}`}
                    >
                      {t.headline}
                      {t.questions && (
                        <Tag
                          variant="warning"
                          size="small"
                          className="typography-review__card-tag"
                        >
                          {t.questions.length} til avklaring
                        </Tag>
                      )}
                    </NavigationCard>
                  ))}
                  <NavigationCard href="#avklaring" title="Til avklaring">
                    {questions.length} spørsmål til design og produkt
                  </NavigationCard>
                </div>
                <Text variant="subparagraph" spacing={{ top: 'xl' }}>
                  ← → bytter tema · PR{' '}
                  {pullRequests.map((n, i) => (
                    <React.Fragment key={n}>
                      {i > 0 && ', '}
                      <Link
                        href={`https://github.com/entur/design-system/pull/${n}`}
                      >
                        {n}
                      </Link>
                    </React.Fragment>
                  ))}
                </Text>
              </>
            )}

            {topic && (
              <>
                <PageHeader
                  overline={`${index}. ${topic.title}`}
                  title={topic.headline}
                >
                  <div className="typography-review__meta">
                    <Chips ids={topic.decisions} onOpen={open} />
                    <Chips ids={topic.questions} onOpen={open} />
                  </div>
                </PageHeader>
                {topic.points && (
                  <div className="typography-review__points">
                    {topic.points.map(point => (
                      <Tag key={point}>{point}</Tag>
                    ))}
                  </div>
                )}
                {topic.scenarios && (
                  <SegmentedControl
                    className="typography-review__scenarios"
                    label="Eksempel"
                    value={topicScenario}
                    onChange={v =>
                      setScenario(s => ({
                        ...s,
                        [topic.id]: v ?? topic.scenarios![0],
                      }))
                    }
                  >
                    {topic.scenarios.map(s => (
                      <SegmentedChoice key={s} value={s}>
                        {s}
                      </SegmentedChoice>
                    ))}
                  </SegmentedControl>
                )}
                {topic.render({ scenario: topicScenario })}
              </>
            )}

            {page === 'avklaring' && (
              <>
                <PageHeader
                  overline="Til avklaring"
                  title={`${questions.length} spørsmål`}
                />
                <div className="typography-review__grid">
                  {questions.map(q => (
                    <BaseCard
                      key={q.id}
                      className={classNames('typography-review__card', {
                        'typography-review__highlight': highlight === q.id,
                      })}
                    >
                      <div className="typography-review__card-head">
                        <Heading as="h2" variant="subtitle-1">
                          {q.id}
                        </Heading>
                        <Tag variant={ownerVariant[q.owner]} size="small">
                          {q.owner}
                        </Tag>
                      </div>
                      <TextContainer>
                        <Heading as="h3" variant="section-1">
                          {q.title}
                        </Heading>
                        <Text variant="subparagraph">{q.context}</Text>
                        <Text>
                          <strong>Forslag:</strong> {q.proposal}
                        </Text>
                        {q.topic && (
                          <Text variant="subparagraph">
                            <Link href={`#${q.topic}`}>Vis eksempel</Link>
                          </Text>
                        )}
                      </TextContainer>
                    </BaseCard>
                  ))}
                </div>
              </>
            )}

            {page === 'figma' && (
              <>
                <PageHeader
                  overline="Figma"
                  title="Må oppdateres hvis godkjent"
                />
                <Text variant="leading" spacing={{ bottom: 'xl' }}>
                  Koden har fått nye navn og farger. Figma må få de samme, så
                  neste eksport stemmer.
                </Text>
                <div className="typography-review__figma-steps">
                  <BaseCard className="typography-review__card">
                    <TextContainer>
                      <Text variant="overline">
                        Tokens-Component · Component spacing
                      </Text>
                      <Heading as="h2" variant="subtitle-1">
                        1. Gi avstandene nye navn
                      </Heading>
                      <Text>
                        Legg dem i gruppen Spacing. Verdiene er de samme.
                      </Text>
                    </TextContainer>
                    <Table spacing="small">
                      <TableHead>
                        <TableRow>
                          <HeaderCell>I dag</HeaderCell>
                          <HeaderCell>Nytt navn</HeaderCell>
                          <HeaderCell>Verdi i standard</HeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {figmaSpacingRenames.map(row => (
                          <TableRow key={row.from}>
                            <DataCell>{row.from}</DataCell>
                            <DataCell>
                              <strong>{row.to}</strong>
                            </DataCell>
                            <DataCell>
                              {row.from.includes('…')
                                ? `${row.px} px …`
                                : `${row.px} px`}
                            </DataCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </BaseCard>

                  <BaseCard className="typography-review__card">
                    <TextContainer>
                      <Text variant="overline">Βeta Typography variables</Text>
                      <Heading as="h2" variant="subtitle-1">
                        2. Rydd i typografi-variablene
                      </Heading>
                      <UnorderedList>
                        <ListItem>
                          Store forbokstaver og bindestrek i stedet for
                          sammenskrevne ord, for eksempel{' '}
                          <strong>Font/lineHeight/heading/s</strong> →{' '}
                          <strong>Font/Line-height/Heading/S</strong>
                        </ListItem>
                        <ListItem>
                          Samme for Size, Paragraph-spacing, Weight og Family
                        </ListItem>
                        <ListItem>
                          Ny tekstvariabel <strong>Font/Family/Mono</strong> for
                          kodetekst, i alle tre modusene
                        </ListItem>
                      </UnorderedList>
                    </TextContainer>
                  </BaseCard>

                  <BaseCard className="typography-review__card">
                    <TextContainer>
                      <Text variant="overline">
                        Tokens-Component · Component colors · typography
                      </Text>
                      <Heading as="h2" variant="subtitle-1">
                        3. Bytt og legg til farger
                      </Heading>
                    </TextContainer>
                    <Table spacing="small">
                      <TableHead>
                        <TableRow>
                          <HeaderCell>Variabel</HeaderCell>
                          <HeaderCell>Light</HeaderCell>
                          <HeaderCell>Dark</HeaderCell>
                          <HeaderCell>Venter på</HeaderCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {figmaColors.map(row => (
                          <TableRow key={row.variable}>
                            <DataCell>
                              {row.variable}
                              {row.isNew && (
                                <Tag
                                  size="small"
                                  className="typography-review__inline-tag"
                                >
                                  Ny
                                </Tag>
                              )}
                            </DataCell>
                            <DataCell>
                              <ColorChange {...row.light} />
                            </DataCell>
                            <DataCell>
                              <ColorChange {...row.dark} />
                            </DataCell>
                            <DataCell>
                              <Chips
                                ids={row.waits?.split(', ')}
                                onOpen={open}
                              />
                            </DataCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </BaseCard>
                </div>
                <Heading
                  as="h2"
                  variant="subtitle-1"
                  spacing={{ top: '3xl', bottom: 's' }}
                >
                  Komponenter og stiler
                </Heading>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderCell>Hva</HeaderCell>
                      <HeaderCell>Endring</HeaderCell>
                      <HeaderCell>Venter på</HeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {figmaUpdates.map(item => (
                      <TableRow key={item.what}>
                        <DataCell>{item.what}</DataCell>
                        <DataCell>{item.details}</DataCell>
                        <DataCell>
                          <Chips ids={item.waits?.split(', ')} onOpen={open} />
                        </DataCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}

            {page === 'endringer' && (
              <>
                <PageHeader
                  overline="Alle endringer"
                  title="Mot main og gammel typografi"
                />
                <div className="typography-review__grid">
                  {(
                    [
                      ['Lagt til', added],
                      ['Endret', changed],
                      ['Fjernet', removed],
                    ] as const
                  ).map(([title, rows]) => (
                    <BaseCard key={title} className="typography-review__card">
                      <TextContainer>
                        <Heading as="h2" variant="subtitle-1">
                          {title}
                        </Heading>
                        <UnorderedList>
                          {rows.map(row => (
                            <ListItem key={row.what}>
                              {row.what}{' '}
                              {row.breaking && (
                                <Tag variant="negative" size="small">
                                  Breaking
                                </Tag>
                              )}
                            </ListItem>
                          ))}
                        </UnorderedList>
                      </TextContainer>
                    </BaseCard>
                  ))}
                </div>
                <Heading
                  as="h2"
                  variant="title-2"
                  spacing={{ top: '2xl', bottom: 's' }}
                >
                  Beslutninger
                </Heading>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderCell>Nr.</HeaderCell>
                      <HeaderCell>Beslutning</HeaderCell>
                      <HeaderCell>Hvorfor</HeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {decisions.map(d => (
                      <TableRow
                        key={d.id}
                        className={classNames({
                          'typography-review__highlight': highlight === d.id,
                        })}
                      >
                        <DataCell>{d.id}</DataCell>
                        <DataCell>{d.title}</DataCell>
                        <DataCell>{d.why}</DataCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Heading
                  as="h2"
                  variant="title-2"
                  spacing={{ top: '2xl', bottom: 's' }}
                >
                  Gjenstår
                </Heading>
                <UnorderedList>
                  {remaining.map(r => (
                    <ListItem key={r}>{r}</ListItem>
                  ))}
                </UnorderedList>
              </>
            )}
          </main>
        </div>
      </div>
    </SettingsContext.Provider>
  );
};
