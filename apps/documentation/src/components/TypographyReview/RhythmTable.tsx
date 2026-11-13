import React, { useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Switch } from '@entur/form';
import {
  Heading,
  ListItem,
  NumberedList,
  Text,
  TextContainer,
  UnorderedList,
} from '@entur/typography/beta';
import { ImagePlaceholder, SettingsContext, Stage } from './helpers';

const P = () => <Text>Avsnitt</Text>;
const H = (props: { variant: any; children?: React.ReactNode }) => (
  <Heading as="div" variant={props.variant}>
    {props.children ?? 'Overskrift'}
  </Heading>
);

type Pair = {
  label: string;
  note?: string;
  first: React.ReactNode;
  second: React.ReactNode;
};

const pairs: Pair[] = [
  { label: 'Title-1 → avsnitt', first: <H variant="title-1" />, second: <P /> },
  { label: 'Title-2 → avsnitt', first: <H variant="title-2" />, second: <P /> },
  {
    label: 'Subtitle-1 → avsnitt',
    first: <H variant="subtitle-1" />,
    second: <P />,
  },
  {
    label: 'Subtitle-2 → avsnitt',
    first: <H variant="subtitle-2" />,
    second: <P />,
  },
  {
    label: 'Section-1 → avsnitt',
    first: <H variant="section-1" />,
    second: <P />,
  },
  {
    label: 'Section-2 → avsnitt',
    first: <H variant="section-2" />,
    second: <P />,
  },
  {
    label: 'Leading → avsnitt',
    first: <Text variant="leading">Ingress</Text>,
    second: <P />,
  },
  { label: 'Avsnitt → avsnitt', first: <P />, second: <P /> },
  {
    label: 'Subparagraph → avsnitt',
    first: <Text variant="subparagraph">Liten tekst</Text>,
    second: <P />,
  },
  {
    label: 'Caption → avsnitt',
    first: <Text variant="caption">Bildetekst</Text>,
    second: <P />,
  },
  {
    label: 'Label → avsnitt',
    first: <Text variant="label">Label</Text>,
    second: <P />,
  },
  {
    label: 'Liste → avsnitt',
    first: (
      <UnorderedList>
        <ListItem>Punkt</ListItem>
      </UnorderedList>
    ),
    second: <P />,
  },
  {
    label: 'Sitat → avsnitt',
    first: <Text variant="quote">Sitat</Text>,
    second: <P />,
  },
  {
    label: 'Sitat med kilde → avsnitt',
    first: (
      <figure>
        <Text variant="quote">Sitat</Text>
        <Text as="figcaption" variant="caption">
          Kilde
        </Text>
      </figure>
    ),
    second: <P />,
  },
  {
    label: 'Preformatert → avsnitt',
    first: <Text variant="preformatted">tekst</Text>,
    second: <P />,
  },
  {
    label: 'Ukjent element → avsnitt',
    note: 'Bilde, tabell, komponent (S2)',
    first: <div>Komponent</div>,
    second: <P />,
  },
  {
    label: 'Avsnitt → liste',
    note: 'Avsnittet innleder listen',
    first: <P />,
    second: (
      <NumberedList>
        <ListItem>Punkt</ListItem>
      </NumberedList>
    ),
  },
  {
    label: 'Bilde → caption',
    first: <ImagePlaceholder />,
    second: <Text variant="caption">Bildetekst</Text>,
  },
  {
    label: 'Avsnitt → Title-2',
    note: 'Ekstra luft over overskriften (B23)',
    first: <P />,
    second: <H variant="title-2" />,
  },
  {
    label: 'Avsnitt → Section-2',
    note: 'Samme ekstra luft som Title-2 (B23)',
    first: <P />,
    second: <H variant="section-2" />,
  },
  {
    label: 'Title-2 → Subtitle-1',
    note: 'Overskrift rett etter overskrift: ingen ekstraluft over',
    first: <H variant="title-2" />,
    second: <H variant="subtitle-1" />,
  },
  {
    label: 'Overline → Title-2',
    first: <Text variant="overline">Overline</Text>,
    second: <H variant="title-2" />,
  },
  {
    label: 'Avsnitt med spacing → avsnitt',
    note: 'spacing={{ bottom: "s" }} erstatter luften etter',
    first: <Text spacing={{ bottom: 's' }}>Avsnitt</Text>,
    second: <P />,
  },
];

/** One pair in its own frame, with the gap measured between the rendered elements */
const PairSample = ({ pair, outlined }: { pair: Pair; outlined: boolean }) => {
  const { density, mode } = React.useContext(SettingsContext);
  const ref = useRef<HTMLDivElement>(null);
  const [gap, setGap] = useState('–');

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;
    const measure = () => {
      const [first, second] = Array.from(container.children);
      if (!first || !second) return;
      const value =
        second.getBoundingClientRect().top -
        first.getBoundingClientRect().bottom;
      setGap(`${Math.round(value)} px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [density, mode]);

  return (
    <div className="typography-review__pair">
      <div className="typography-review__pair-head">
        <span>{pair.label}</span>
        <strong>{gap}</strong>
      </div>
      <TextContainer
        ref={ref}
        className={classNames('typography-review__pair-sample', {
          'typography-review__pair-sample--outlined': outlined,
        })}
      >
        {pair.first}
        {pair.second}
      </TextContainer>
      {pair.note && (
        <div className="typography-review__pair-note">{pair.note}</div>
      )}
    </div>
  );
};

export const RhythmTable = () => {
  const [outlines, setOutlines] = useState(true);
  return (
    <>
      <Switch
        checked={outlines}
        onChange={e => setOutlines(e.target.checked)}
        className="typography-review__example-switch"
      >
        Vis elementkanter
      </Switch>
      <Stage>
        <div className="typography-review__pairs">
          {pairs.map(pair => (
            <PairSample key={pair.label} pair={pair} outlined={outlines} />
          ))}
        </div>
      </Stage>
    </>
  );
};
