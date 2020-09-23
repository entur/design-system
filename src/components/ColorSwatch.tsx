import React from 'react';
import { colors } from '@entur/tokens';
import { formatVariable } from '~/utils/formatVariable';
import { useSettings } from './SettingsContext';
import hexrgb from 'hex-rgb';
import './ColorSwatch.scss';
import { BaseCard } from '@entur/layout';
import { GridItem } from '@entur/grid';
import { useColorContext } from './Colors';
import { Heading4 } from '@entur/typography';

export function getColorFromPath(path: string) {
  return path
    .split('.')
    .reduce(
      (currentObject: any, key: string) =>
        currentObject ? currentObject[key] : null,
      colors,
    );
}

type Props = {
  path: string;
  style?: any;
  children?: string;
  cmyk?: string;
  title: string;
};

const ColorSwatch: React.FC<Props> = ({
  children,
  path,
  style,
  cmyk,
  title,
}) => {
  const backgroundColor = getColorFromPath(path);
  const { variableFormat } = useSettings();
  const variableName = formatVariable(`colors.${path}`, variableFormat);
  const rgb = hexrgb(backgroundColor, { format: 'array' });

  const { setChosenColor } = useColorContext();

  return (
    <GridItem small={6} medium={4}>
      <BaseCard
        className="color-swatch"
        as="button"
        onClick={() =>
          setChosenColor!({
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
          <Heading4 margin="none">{title}</Heading4>
          <div style={{ textTransform: 'uppercase' }}>{backgroundColor}</div>
        </div>
      </BaseCard>
    </GridItem>
  );
};

export default ColorSwatch;
