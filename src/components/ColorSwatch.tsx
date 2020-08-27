import React from 'react';
import { colors } from '@entur/tokens';
import { StrongText } from '@entur/typography';
import { formatVariable } from '~/utils/formatVariable';
import { useSettings } from './SettingsContext';
import { DataCell, TableRow } from '@entur/table';
import { CopyButton } from './CopyButton';
import hexrgb from 'hex-rgb';
import './ColorSwatch.scss';
import { NavigationCard, MediaCard, BaseCard } from '@entur/layout';
import { GridItem } from '@entur/grid';

function getColorFromPath(path: string) {
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

  return (
    <GridItem small={6} medium={4}>
      <BaseCard className="color-swatch" as="button">
        <div
          className="color-square"
          style={{ backgroundColor: backgroundColor, ...style }}
        />
        <div className="color-description">
          <div>{children}</div>
          <div>{backgroundColor}</div>
        </div>
      </BaseCard>
    </GridItem>
  );
};

export default ColorSwatch;
