import React from 'react';
import { colors } from '@entur/tokens';
import { StrongText } from '@entur/typography';
import { formatVariable } from '~/utils/formatVariable';
import { useSettings } from './SettingsContext';
import { DataCell, TableRow } from '@entur/table';
import { CopyButton } from './CopyButton';
import hexrgb from 'hex-rgb';
import './ColorSwatch.scss';

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
};

const ColorSwatch: React.FC<Props> = ({ children, path, type, style }) => {
  const backgroundColor = getColorFromPath(path);
  const { variableFormat } = useSettings();
  const variableName = formatVariable(`colors.${path}`, variableFormat);
  const rgb = hexrgb(backgroundColor, { format: 'array' });

  return (
    <TableRow className="color-swatch">
      <DataCell>
        <div
          className="color-square"
          style={{ backgroundColor: backgroundColor, ...style }}
        />
      </DataCell>
      <DataCell>
        <StrongText style={{ textTransform: 'capitalize' }}>
          {children}
        </StrongText>
      </DataCell>
      <DataCell>{type}</DataCell>
      <DataCell>{variableName}</DataCell>

      <DataCell>
        <CopyButton textToCopy={backgroundColor}>{backgroundColor}</CopyButton>
      </DataCell>
      <DataCell>
        {rgb[0]}, {rgb[1]}, {rgb[2]}{' '}
      </DataCell>
    </TableRow>
  );
};

export default ColorSwatch;
