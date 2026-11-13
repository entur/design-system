import React from 'react';
import classNames from 'classnames';

import { Radio, RadioGroup } from '@entur/form';
import { Modal } from '@entur/modal';
import { Tooltip } from '@entur/tooltip';
import { Text } from '@entur/typography/beta';

import { DownloadList, IllustrationPreview } from './IllustrationDetails';
import {
  Illustration,
  PRINCIPLES_COMPOSITION,
  STYLES,
} from './useGetIllustrations';

const WHOLE = 'whole';
/** Frame size of «Principles Composition» in Figma, which the PNG exports match 1:1 */
export const PRINCIPLES_FRAME = { width: 1778, height: 1667 };
export const principlesAspectRatio = `${PRINCIPLES_FRAME.width} / ${PRINCIPLES_FRAME.height}`;

// Where each part sits in the composition frame in Figma
const PARTS: {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Covers other parts, so it is placed under them to keep theirs clickable */
  behind?: boolean;
}[] = [
  { name: 'Bruker', x: 554, y: 712, w: 657, h: 865, behind: true },
  { name: 'Vi skaper verdi', x: 659, y: 25, w: 460, h: 617 },
  { name: 'Vi jobber sammen V2', x: 1064, y: 336, w: 382, h: 631 },
  { name: 'Vi leverer hyppig', x: 1125, y: 879, w: 460, h: 617 },
  { name: 'Vi beslutter med data', x: 70, y: 879, w: 460, h: 617 },
  { name: 'Vi lærer og deler', x: 294, y: 185, w: 460, h: 617 },
  { name: 'Vi lærer og deler ekstra', x: 279, y: 629, w: 213, h: 326 },
];

const WHOLE_VERSIONS = [
  { name: PRINCIPLES_COMPOSITION, label: 'Uten tekst' },
  {
    name: `${PRINCIPLES_COMPOSITION} all caps`,
    label: 'Med tekst, store bokstaver',
  },
  {
    name: `${PRINCIPLES_COMPOSITION} lower case`,
    label: 'Med tekst, små bokstaver',
  },
];

const percent = (value: number, total: number) => `${(value / total) * 100}%`;
const boxStyle = (p: (typeof PARTS)[number]) => ({
  left: percent(p.x, PRINCIPLES_FRAME.width),
  top: percent(p.y, PRINCIPLES_FRAME.height),
  width: percent(p.w, PRINCIPLES_FRAME.width),
  height: percent(p.h, PRINCIPLES_FRAME.height),
  zIndex: p.behind ? 0 : 1,
});

export const isPrinciplesPart = (illustration: Illustration) =>
  !illustration.name.startsWith(PRINCIPLES_COMPOSITION);

export const PrinciplesDetails = ({
  illustrations,
  initialPart,
  onDismiss,
}: {
  illustrations: Illustration[];
  initialPart?: string;
  onDismiss: () => void;
}) => {
  const byName = (name: string) => illustrations.find(i => i.name === name);
  const mapped = PARTS.filter(p => byName(p.name));
  // Parts on the map first, in marker order, so the list numbers match the markers
  const parts = [
    ...mapped.map(p => byName(p.name) as Illustration),
    ...illustrations.filter(
      i => isPrinciplesPart(i) && !PARTS.some(p => p.name === i.name),
    ),
  ];
  const markerNumber = (name: string) =>
    mapped.findIndex(p => p.name === name) + 1;

  const [selected, setSelected] = React.useState(initialPart ?? WHOLE);
  const [wholeVersion, setWholeVersion] = React.useState(
    PRINCIPLES_COMPOSITION,
  );
  const [style, setStyle] = React.useState('');
  const [hovered, setHovered] = React.useState<string | null>(null);
  const select = (name: string) => {
    setSelected(name);
    setStyle('');
  };

  const part = selected === WHOLE ? undefined : byName(selected);
  const wholeVariant = (byName(wholeVersion) ?? byName(PRINCIPLES_COMPOSITION))
    ?.variants[0];
  const partVariant = part
    ? part.variants.find(v => v.style === style) ?? part.variants[0]
    : undefined;
  const styles = STYLES.filter(s =>
    part?.variants.some(v => v.style === s.value),
  );
  const mapVariant = part
    ? byName(PRINCIPLES_COMPOSITION)?.variants[0]
    : wholeVariant;
  const downloadVariant = partVariant ?? wholeVariant;

  if (!mapVariant || !downloadVariant) return null;

  return (
    <Modal
      open
      size="extraLarge"
      title="Utviklingsprinsipper"
      onDismiss={onDismiss}
      closeLabel="Lukk"
    >
      <Text as="p" variant="subparagraph" className="illustration-dialog__lead">
        Last ned hele illustrasjonen, eller velg en del. Klikk på et nummer i
        illustrasjonen eller velg fra listen.
      </Text>
      <div className="principles">
        <div className="principles__map">
          <IllustrationPreview
            variant={mapVariant}
            className="principles__composition"
            style={{ aspectRatio: principlesAspectRatio }}
          />
          {mapped.map((p, index) => (
            // Mouse shortcut for the «Del» radio list, which is the accessible control
            <button
              key={p.name}
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className={classNames('principles__hotspot', {
                'principles__hotspot--selected': selected === p.name,
                'principles__hotspot--hovered': hovered === p.name,
              })}
              style={boxStyle(p)}
              onClick={() => select(p.name)}
              onMouseEnter={() => setHovered(p.name)}
              onMouseLeave={() => setHovered(null)}
            >
              <Tooltip
                content={p.name}
                placement="right"
                isOpen={hovered === p.name}
                showCloseButton={false}
              >
                <span className="principles__marker">{index + 1}</span>
              </Tooltip>
            </button>
          ))}
        </div>

        <div className="principles__panel">
          <RadioGroup
            name="principles-part"
            label="Del"
            value={selected}
            onChange={e => select(e.target.value)}
          >
            <Radio value={WHOLE}>Hele illustrasjonen</Radio>
            {parts.map(p => {
              const number = markerNumber(p.name);
              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHovered(p.name)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(p.name)}
                  onBlur={() => setHovered(null)}
                >
                  <Radio value={p.name}>
                    {number > 0 && (
                      <span
                        className="principles__list-number"
                        aria-hidden="true"
                      >
                        {number}
                      </span>
                    )}
                    {p.name}
                  </Radio>
                </div>
              );
            })}
          </RadioGroup>

          {part === undefined ? (
            <RadioGroup
              name="principles-whole-version"
              label="Versjon"
              value={wholeVersion}
              onChange={e => setWholeVersion(e.target.value)}
            >
              {WHOLE_VERSIONS.filter(v => byName(v.name)).map(v => (
                <Radio key={v.name} value={v.name}>
                  {v.label}
                </Radio>
              ))}
            </RadioGroup>
          ) : (
            <>
              <IllustrationPreview
                variant={downloadVariant}
                className="principles__part-preview"
              />
              {styles.length > 1 && (
                <RadioGroup
                  name="principles-style"
                  label="Variant"
                  value={style}
                  onChange={e => setStyle(e.target.value)}
                >
                  {styles.map(s => (
                    <Radio key={s.value} value={s.value}>
                      {s.label}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            </>
          )}

          <DownloadList
            heading={`Last ned ${
              part ? `«${part.name}»` : 'hele illustrasjonen'
            }`}
            variant={downloadVariant}
          />
        </div>
      </div>
    </Modal>
  );
};
