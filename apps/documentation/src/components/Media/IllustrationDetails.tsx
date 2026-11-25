import React from 'react';
import classNames from 'classnames';
import { GatsbyImage } from 'gatsby-plugin-image';

import { SecondaryButton } from '@entur/button';
import { Radio, RadioGroup, Switch } from '@entur/form';
import { DownloadIcon } from '@entur/icons';
import { Modal } from '@entur/modal';
import { Heading, Text } from '@entur/typography/beta';

import { categoryLabel } from './illustrationCategories';
import {
  COLOR_MODES,
  ColorMode,
  Illustration,
  IllustrationVariant,
  pickVariant,
} from './useGetIllustrations';

const FORMATS: { extension: string; label: string; usage: string }[] = [
  {
    extension: 'svg',
    label: 'SVG',
    usage: 'Til nettsider og apper. Skalerer uten tap av kvalitet.',
  },
  {
    extension: 'png',
    label: 'PNG',
    usage: 'Til presentasjoner, dokumenter og sosiale medier.',
  },
  { extension: 'pdf', label: 'PDF', usage: 'Til trykk.' },
];

const fileNameOf = (publicUrl: string) =>
  decodeURIComponent(publicUrl.split('/').pop() ?? publicUrl);

export const IllustrationPreview = ({
  variant,
  className,
  style,
}: {
  variant: IllustrationVariant;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={classNames('illustration-preview', className, {
      'eds-contrast': variant.colorMode === 'contrast',
    })}
    data-color-mode={variant.colorMode === 'darkmode' ? 'dark' : 'light'}
    style={style}
  >
    {typeof variant.image === 'string' ? (
      <img src={variant.image} alt="" loading="lazy" />
    ) : (
      variant.image && (
        <GatsbyImage image={variant.image} alt="" objectFit="contain" />
      )
    )}
  </div>
);

export const DownloadList = ({
  heading,
  variant,
}: {
  heading: string;
  variant: IllustrationVariant;
}) => {
  const headingId = React.useId();
  const files = FORMATS.flatMap(format => {
    const file = variant.files.find(f => f.extension === format.extension);
    return file
      ? [{ ...format, ...file, fileName: fileNameOf(file.publicUrl) }]
      : [];
  });

  return (
    <section aria-labelledby={headingId}>
      <Heading as="h3" variant="subtitle-2" id={headingId}>
        {heading}
      </Heading>
      <ul className="illustration-details__formats">
        {files.map(file => (
          <li key={file.publicUrl} className="illustration-details__format">
            <div className="illustration-details__format-text">
              <Text as="p" variant="label">
                {file.label}
              </Text>
              <Text as="p" variant="subparagraph">
                {file.usage}
              </Text>
            </div>
            <SecondaryButton
              as="a"
              href={file.publicUrl}
              download={file.fileName}
              size="small"
              aria-label={`Last ned ${file.fileName}`}
              className="illustration-details__download"
            >
              <DownloadIcon aria-hidden="true" />
              {file.label}
            </SecondaryButton>
          </li>
        ))}
      </ul>
    </section>
  );
};

export const IllustrationDetails = ({
  illustration,
  initialVariant,
  onDismiss,
}: {
  illustration: Illustration;
  initialVariant: IllustrationVariant;
  onDismiss: () => void;
}) => {
  const { variants } = illustration;
  const [colorMode, setColorMode] = React.useState(initialVariant.colorMode);
  const [withBackground, setWithBackground] = React.useState(
    initialVariant.hasBackground,
  );

  const modes = COLOR_MODES.filter(m =>
    variants.some(v => v.colorMode === m.value),
  );
  const existsInMode = (background: boolean) =>
    variants.some(
      v => v.colorMode === colorMode && v.hasBackground === background,
    );
  const canToggleBackground = existsInMode(true) && existsInMode(false);
  const selected = pickVariant(illustration, colorMode, withBackground);

  return (
    <Modal
      open
      size="large"
      title={illustration.name}
      onDismiss={onDismiss}
      closeLabel="Lukk"
    >
      <Text as="p" variant="subparagraph" className="illustration-dialog__lead">
        {categoryLabel(illustration.category)}
      </Text>
      <div className="illustration-details">
        <IllustrationPreview
          variant={selected}
          className="illustration-details__preview"
        />
        <div className="illustration-details__options">
          {(modes.length > 1 || canToggleBackground) && (
            <div className="illustration-details__version">
              {modes.length > 1 && (
                <RadioGroup
                  name="illustration-color-mode"
                  label="Fargemodus"
                  value={colorMode}
                  onChange={e => setColorMode(e.target.value as ColorMode)}
                >
                  <div className="illustration-details__inline-options">
                    {modes.map(m => (
                      <Radio key={m.value} value={m.value}>
                        {m.label}
                      </Radio>
                    ))}
                  </div>
                </RadioGroup>
              )}
              {canToggleBackground && (
                <Switch
                  checked={selected.hasBackground}
                  onChange={() => setWithBackground(!selected.hasBackground)}
                >
                  Med bakgrunn
                </Switch>
              )}
            </div>
          )}
          <DownloadList heading="Last ned" variant={selected} />
        </div>
      </div>
    </Modal>
  );
};
