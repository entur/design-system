import React from 'react';
import { colors, space } from '@entur/tokens';
import hexrgb from 'hex-rgb';
import { BaseCard } from '@entur/layout';
import { GridItem } from '@entur/grid';
import { Heading4 } from '@entur/typography';
import { formatVariable } from '../../utils/formatVariable';
import { useSettings } from '@providers/SettingsContext';
import { useColorContext } from '@providers/ColorProvider';

import './ColorSwatch.scss';

export function getColorFromPath(path: string): string {
  return path
    .split('.')
    .reduce(
      (currentObject: any, key: string) =>
        currentObject ? currentObject[key] : null,
      colors,
    );
}

type Props = {
  /** Dot-notation path into `colors`. Ignored when `hex` is given */
  path?: string;
  /** Colour to show, for palettes that do not live under `colors` */
  hex?: string;
  /** Variable name to copy, for palettes that do not live under `colors` */
  variable?: string;
  style?: any;
  children?: string;
  cmyk?: string;
  title: string;
  topLabel?: string;
};

const ColorSwatch: React.FC<Props> = ({
  children,
  path,
  hex,
  variable,
  style,
  cmyk,
  title,
  topLabel,
}) => {
  const backgroundColor = hex ?? getColorFromPath(path as string);
  const { variableFormat } = useSettings();
  const variableName =
    variable ?? formatVariable(`colors.${path}`, variableFormat);
  const rgb = hexrgb(backgroundColor, { format: 'array' });

  const { setChosenColor } = useColorContext();
  return (
    <GridItem small={6} medium={4}>
      {topLabel && <div className="eds-label">{topLabel}</div>}
      <BaseCard
        className="color-swatch"
        as="button"
        style={{ marginTop: space.small }}
        onClick={() =>
          setChosenColor &&
          setChosenColor({
            name: title,
            children: children,
            hex: backgroundColor,
            variable: variableName,
            rgb: rgb.toString(),
            cmyk: cmyk,
          })
        }
      >
        <div
          className="color-square"
          style={{ backgroundColor: backgroundColor, ...style }}
        />
        <div className="color-description">
          <Heading4
            as="h3"
            margin="none"
            style={{ textTransform: 'capitalize' }}
          >
            {title}
          </Heading4>
          <div style={{ textTransform: 'uppercase' }}>{backgroundColor}</div>
        </div>
      </BaseCard>
    </GridItem>
  );
};

export default ColorSwatch;
