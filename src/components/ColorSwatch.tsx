import React from 'react';
import { hex } from 'wcag-contrast';
import { useToast } from '@entur/alert';
import { colors } from '@entur/tokens';
import { ReportsIcon } from '@entur/icons';
import { StrongText } from '@entur/typography';
import { formatVariable } from '~/utils/formatVariable';
import { useSettings } from './SettingsContext';
import { DataCell, TableRow } from '@entur/table';
import copy from 'copy-text-to-clipboard';
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

function getBestForegroundColorForBackground(backgroundColor: string) {
  const contrastWithWhite = hex(colors.brand.white, backgroundColor);
  const contrastWithBlue = hex(colors.brand.blue, backgroundColor);

  if (contrastWithWhite >= contrastWithBlue) {
    return colors.brand.white;
  }
  if (contrastWithBlue >= 4.5) {
    return colors.brand.blue;
  }
  // Fallback color for when blue doesn't give us a strong enough contrast
  return colors.misc.black;
}

type Props = {
  path: string;
  type: string;
  style?: any;
};

const ColorSwatch: React.FC<Props> = ({ children, path, type, style }) => {
  const { addToast } = useToast();
  const backgroundColor = getColorFromPath(path);
  const { variableFormat } = useSettings();
  const variableName = formatVariable(`colors.${path}`, variableFormat);

  const handleCopyClick = (textToCopy: string) => () => {
    copy(textToCopy);
    addToast(`"${textToCopy}" er kopiert til utklippstavla`);
  };

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

      <DataCell>{backgroundColor}</DataCell>
      <DataCell>
        {rgb[0]}, {rgb[1]}, {rgb[2]}{' '}
      </DataCell>
    </TableRow>
  );
};

export default ColorSwatch;
