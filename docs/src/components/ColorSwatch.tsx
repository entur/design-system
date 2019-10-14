import React from 'react';
import { hex } from 'wcag-contrast';
import { colors } from '@entur/tokens';
import { StrongText } from '@entur/typography';

import './ColorSwatch.scss';
import { useSettings, VariableFormat } from './SettingsContext';

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

function getVariableNameFromPath(path: string, variableFormat: VariableFormat) {
  const kebabCasedPath = path
    .replace(/\./g, '-') // replaces . with -
    .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2') // camelCase to kebab-case
    .toLowerCase();

  switch (variableFormat) {
    case 'scss':
      return `$colors-${kebabCasedPath}`;
    case 'less':
      return `@colors-${kebabCasedPath}`;
    case 'css':
      return `var(--colors-${kebabCasedPath})`;
    case 'js':
      return `colors.${path}`;
  }
}

type Props = {
  path: string;
  style?: any;
};

const ColorSwatch: React.FC<Props> = ({ children, path, style }) => {
  const { variableFormat } = useSettings();
  const backgroundColor = getColorFromPath(path);
  const foregroundColor = getBestForegroundColorForBackground(backgroundColor);
  const variableName = getVariableNameFromPath(path, variableFormat);

  return (
    <div
      className="color-swatch"
      style={{ backgroundColor, color: foregroundColor, ...style }}
    >
      <StrongText>{children}</StrongText>
      <div className="color-swatch__details">
        {backgroundColor}
        <br />
        {variableName}
      </div>
    </div>
  );
};

export default ColorSwatch;
