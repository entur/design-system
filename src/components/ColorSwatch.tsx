import React from 'react';
import { hex } from 'wcag-contrast';
import copy from 'copy-text-to-clipboard';
import { useToast } from '@entur/alert';
import { colors } from '@entur/tokens';
import { ReportsIcon } from '@entur/icons';
import { StrongText } from '@entur/typography';
import { formatVariable } from '~/utils/formatVariable';
import './ColorSwatch.scss';
import { useSettings } from './SettingsContext';

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
  style?: any;
};

const ColorSwatch: React.FC<Props> = ({ children, path, style }) => {
  const { addToast } = useToast();
  const backgroundColor = getColorFromPath(path);
  const foregroundColor = getBestForegroundColorForBackground(backgroundColor);
  const { variableFormat } = useSettings();
  const variableName = formatVariable(`colors.${path}`, variableFormat);

  const handleCopyClick = (textToCopy: string) => () => {
    copy(textToCopy);
    addToast(`"${textToCopy}" er kopiert til utklippstavla`);
  };

  return (
    <div
      className="color-swatch"
      style={{ backgroundColor, color: foregroundColor, ...style }}
    >
      <StrongText>{children}</StrongText>
      <div className="color-swatch__details">
        <button
          className="color-swatch__copy-button"
          onClick={handleCopyClick(backgroundColor)}
          type="button"
        >
          {backgroundColor} <ReportsIcon inline={true} />
        </button>
        <button
          className="color-swatch__copy-button"
          onClick={handleCopyClick(variableName)}
          type="button"
        >
          {variableName} <ReportsIcon inline={true} />
        </button>
      </div>
    </div>
  );
};

export default ColorSwatch;
