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
  type: string;
  style?: any;
  children: string;
};

const ColorSwatch: React.FC<Props> = ({ children, path, type, style }) => {
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
            name: children,
            hex: backgroundColor,
            variable: variableName,
            rgb: rgb.toString(),
          })
        }
      >
        <div
          className="color-square"
          style={{ backgroundColor: backgroundColor, ...style }}
        />
        <div className="color-description">
          <Heading4 margin="none">{children}</Heading4>
          <div style={{ textTransform: 'uppercase' }}>{backgroundColor}</div>
        </div>
      </BaseCard>
    </GridItem>
  );
};

export default ColorSwatch;
