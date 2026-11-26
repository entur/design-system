import React from 'react';
import classNames from 'classnames';
import { graphql, useStaticQuery } from 'gatsby';

import { SecondaryButton } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { Radio, RadioGroup } from '@entur/form';
import { DownloadIcon } from '@entur/icons';
import { Modal } from '@entur/modal';
import { Heading, Text } from '@entur/typography/beta';

import {
  SCENE_HEIGHT,
  SCENE_PEOPLE,
  SCENE_PLACES,
  SCENE_WIDTH,
  composeScene,
  downloadPng,
  downloadSvg,
  sceneFileName,
} from './scenarioScene';
import { COLOR_MODES, ColorMode, Illustration } from './useGetIllustrations';

const svgCache = new Map<string, Promise<string>>();
const fetchSvg = (url: string) => {
  if (!svgCache.has(url)) {
    svgCache.set(
      url,
      fetch(url).then(response => {
        if (!response.ok) throw new Error(`Fant ikke ${url}`);
        return response.text();
      }),
    );
  }
  return svgCache.get(url)!;
};

const useBackgrounds = () => {
  const query = useStaticQuery(graphql`
    query ScenarioBackgroundsQuery {
      allFile(
        filter: {
          sourceInstanceName: { eq: "downloads" }
          relativeDirectory: { eq: "scenario-builder" }
          extension: { eq: "svg" }
        }
      ) {
        nodes {
          name
          publicURL
        }
      }
    }
  `);
  return new Map<string, string>(
    query.allFile.nodes.map((n: { name: string; publicURL: string }) => [
      n.name,
      n.publicURL,
    ]),
  );
};

const FORMATS = [
  {
    label: 'SVG',
    usage: 'Til nettsider og apper. Skalerer uten tap av kvalitet.',
    save: downloadSvg,
  },
  {
    label: 'PNG',
    usage: 'Til presentasjoner, dokumenter og sosiale medier.',
    save: downloadPng,
  },
];

export const ScenarioBuilder = ({
  travellers,
  initialColorMode,
  initialPerson,
  onDismiss,
}: {
  /** The illustrations in Travellers, where the people come from */
  travellers: Illustration[];
  initialColorMode: ColorMode;
  initialPerson?: string;
  onDismiss: () => void;
}) => {
  const backgrounds = useBackgrounds();
  const people = SCENE_PEOPLE.filter(name =>
    travellers.some(t => t.name === name),
  ).map(name => ({ value: name, label: name }));

  const [person, setPerson] = React.useState(
    people.find(p => p.value === initialPerson) ?? people[0],
  );
  const [placeValue, setPlaceValue] = React.useState(SCENE_PLACES[0].value);
  const [colorMode, setColorMode] = React.useState(initialColorMode);
  const [svg, setSvg] = React.useState<string | null>(null);
  const [error, setError] = React.useState(false);
  const headingId = React.useId();

  const place = SCENE_PLACES.find(p => p.value === placeValue)!;
  const suffix = colorMode === 'standard' ? '' : `-${colorMode}`;
  const backgroundUrl = backgrounds.get(`${place.value}${suffix}`);
  const personUrl = travellers
    .find(t => t.name === person?.value)
    ?.variants.find(v => v.colorMode === colorMode && !v.hasBackground)
    ?.files.find(f => f.extension === 'svg')?.publicUrl;

  React.useEffect(() => {
    if (!backgroundUrl || !personUrl || !person) return;
    let current = true;
    setError(false);
    Promise.all([fetchSvg(backgroundUrl), fetchSvg(personUrl)])
      .then(([background, figure]) => {
        if (current)
          setSvg(composeScene(background, figure, person.value, place));
      })
      .catch(() => current && setError(true));
    return () => {
      current = false;
    };
  }, [backgroundUrl, personUrl, person, place]);

  const previewUrl = React.useMemo(
    () =>
      svg
        ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
        : null,
    [svg],
  );
  const fileName = person ? sceneFileName(person.value, place, colorMode) : '';

  return (
    <Modal
      open
      size="large"
      title="Scenariobygger"
      onDismiss={onDismiss}
      closeLabel="Lukk"
    >
      <Text as="p" variant="subparagraph" className="illustration-dialog__lead">
        Velg en person fra «Reisende» og et sted. Illustrasjonen settes sammen
        her i nettleseren.
      </Text>
      <div className="illustration-details">
        <div
          className={classNames(
            'illustration-preview',
            'illustration-details__preview',
            { 'eds-contrast': colorMode === 'contrast' },
          )}
          data-color-mode={colorMode === 'darkmode' ? 'dark' : 'light'}
          style={{ aspectRatio: `${SCENE_WIDTH} / ${SCENE_HEIGHT}` }}
        >
          {previewUrl && (
            <img
              src={previewUrl}
              alt={`${person?.label}, ${place.label.toLowerCase()}`}
            />
          )}
        </div>
        <div className="illustration-details__options">
          <div className="illustration-details__version">
            <Dropdown
              label="Person"
              items={people}
              selectedItem={person}
              onChange={item => {
                if (item) setPerson(item);
              }}
            />
            <RadioGroup
              name="scenario-place"
              label="Sted"
              value={placeValue}
              onChange={e => setPlaceValue(e.target.value)}
            >
              <div className="illustration-details__inline-options">
                {SCENE_PLACES.map(p => (
                  <Radio key={p.value} value={p.value}>
                    {p.label}
                  </Radio>
                ))}
              </div>
            </RadioGroup>
            <RadioGroup
              name="scenario-color-mode"
              label="Fargemodus"
              value={colorMode}
              onChange={e => setColorMode(e.target.value as ColorMode)}
            >
              <div className="illustration-details__inline-options">
                {COLOR_MODES.map(m => (
                  <Radio key={m.value} value={m.value}>
                    {m.label}
                  </Radio>
                ))}
              </div>
            </RadioGroup>
          </div>
          <section aria-labelledby={headingId}>
            <Heading as="h3" variant="subtitle-2" id={headingId}>
              Last ned
            </Heading>
            {error && (
              <Text as="p" variant="subparagraph">
                Klarte ikke å hente illustrasjonen. Prøv igjen senere.
              </Text>
            )}
            <ul className="illustration-details__formats">
              {FORMATS.map(format => (
                <li key={format.label} className="illustration-details__format">
                  <div className="illustration-details__format-text">
                    <Text as="p" variant="label">
                      {format.label}
                    </Text>
                    <Text as="p" variant="subparagraph">
                      {format.usage}
                    </Text>
                  </div>
                  <SecondaryButton
                    size="small"
                    disabled={!svg}
                    onClick={() => {
                      if (!svg || !person) return;
                      format.save(svg, fileName);
                      // Built in the browser, so autocapture sees no download link; only sent with consent
                      window.posthog?.capture('illustration_downloaded', {
                        illustration: sceneFileName(
                          person.value,
                          place,
                          'standard',
                        ),
                        format: format.label.toLowerCase(),
                        color_mode: colorMode,
                        person: person.value,
                        place: place.value,
                        source: 'scenario-builder',
                      });
                    }}
                    aria-label={`Last ned ${fileName}.${format.label.toLowerCase()}`}
                    className="illustration-details__download"
                  >
                    <DownloadIcon aria-hidden="true" />
                    {format.label}
                  </SecondaryButton>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Modal>
  );
};
