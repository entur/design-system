import React from 'react';
import classNames from 'classnames';

import { CopyableText } from '@entur/alert';
import { SecondaryButton } from '@entur/button';
import { ExpandableText } from '@entur/expand';
import { Switch } from '@entur/form';
import { DownloadIcon } from '@entur/icons';
import { Modal } from '@entur/modal';
import { Heading, Text } from '@entur/typography/beta';

import { categoryLabel, categoryOf } from './iconCategories';
import type { IconItem } from './IconList';

// Icons default to 1em, so these match the text sizes they usually sit next to
const ACTUAL_SIZES = [12, 16, 20, 24];

export const IconPreview = ({
  icon,
  size,
  className,
}: {
  icon: IconItem;
  size: string;
  className?: string;
}) => {
  const IconComponent = icon.component as React.ComponentType<
    React.SVGProps<SVGSVGElement> & { ref?: React.Ref<SVGSVGElement> }
  >;
  // Inline SVGs ignore the viewBox ratio for width: auto, so wide logos get their width from it
  const [ratio, setRatio] = React.useState(1);
  const measure = React.useCallback((svg: SVGSVGElement | null) => {
    const box = svg?.viewBox?.baseVal;
    if (box && box.width && box.height) setRatio(box.width / box.height);
  }, []);
  return (
    <IconComponent
      ref={measure}
      aria-hidden="true"
      className={classNames('icon-preview', className)}
      style={{ height: size, width: `calc(${size} * ${ratio})` }}
    />
  );
};

export const IconDetails = ({
  icon,
  variants,
  contrast: pageContrast,
  onSelectVariant,
  onDismiss,
}: {
  icon: IconItem;
  /** The Kontrast switch on the page */
  contrast: boolean;
  /** The outline and filled versions of the icon, if both exist */
  variants: IconItem[];
  onSelectVariant: (icon: IconItem) => void;
  onDismiss: () => void;
}) => {
  const alwaysDark = Boolean(categoryOf(icon.group)?.dark || icon.onDark);
  const [contrast, setContrast] = React.useState(pageContrast || alwaysDark);
  const componentName = `${icon.name}Icon`;

  return (
    <Modal
      open
      size="large"
      title={componentName}
      onDismiss={onDismiss}
      closeLabel="Lukk"
    >
      <Text as="p" variant="subparagraph" className="icon-details__lead">
        {categoryLabel(icon.group)}
      </Text>
      <div className="icon-details">
        <div className="icon-details__visual">
          {!alwaysDark && (
            <Switch
              checked={contrast}
              onChange={() => setContrast(!contrast)}
              className="icon-details__contrast"
            >
              Kontrast
            </Switch>
          )}
          <div
            className={classNames('icon-details__stage', {
              'eds-contrast': contrast,
            })}
          >
            <IconPreview icon={icon} size="6rem" />
          </div>
          <div
            className={classNames('icon-details__sizes', {
              'eds-contrast': contrast,
            })}
          >
            {ACTUAL_SIZES.map(px => (
              <figure key={px} className="icon-details__size">
                <IconPreview icon={icon} size={`${px}px`} />
                <Text as="figcaption" variant="caption">
                  {px}px
                </Text>
              </figure>
            ))}
          </div>
        </div>

        <div className="icon-details__info">
          <section>
            <Heading as="h3" variant="subtitle-2">
              Kode
            </Heading>
            <div className="icon-details__code">
              <CopyableText
                successHeading="Kopiert"
                successMessage={`Importen av ${componentName} ligger i utklippstavlen.`}
              >
                {`import { ${componentName} } from '@entur/icons';`}
              </CopyableText>
              <CopyableText
                successHeading="Kopiert"
                successMessage={`${componentName} ligger i utklippstavlen.`}
              >
                {`<${componentName} />`}
              </CopyableText>
            </div>
            {icon.aliases.length > 0 && (
              <Text
                as="p"
                variant="subparagraph"
                className="icon-details__alias"
              >
                Samme ikon finnes også som{' '}
                {icon.aliases.map((alias, index) => (
                  <React.Fragment key={alias}>
                    {index > 0 && ', '}
                    <code>{`${alias}Icon`}</code>
                  </React.Fragment>
                ))}
                .
              </Text>
            )}
          </section>

          {variants.length > 1 && (
            <section>
              <Heading as="h3" variant="subtitle-2">
                Varianter
              </Heading>
              <ul className="icon-details__variants">
                {variants.map(variant => (
                  <li key={variant.name}>
                    <button
                      type="button"
                      className="icon-details__variant"
                      aria-pressed={variant.name === icon.name}
                      onClick={() => onSelectVariant(variant)}
                    >
                      <IconPreview icon={variant} size="1.5rem" />
                      <Text as="span" variant="label">
                        {variant.name.endsWith('Filled') ? 'Fylt' : 'Strek'}
                      </Text>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <Heading as="h3" variant="subtitle-2">
              Last ned
            </Heading>
            <SecondaryButton
              as="a"
              href={icon.downloadUrl}
              download={`${icon.name}.svg`}
              size="small"
              aria-label={`Last ned ${icon.name}.svg`}
            >
              <DownloadIcon aria-hidden="true" />
              SVG
            </SecondaryButton>
          </section>

          {icon.keywords.length > 0 && (
            <ExpandableText title="Søkeord" titleElement="SubParagraph">
              <Text as="p" variant="subparagraph">
                {icon.keywords.join(', ')}
              </Text>
            </ExpandableText>
          )}
        </div>
      </div>
    </Modal>
  );
};
