import React from 'react';
import { hex } from 'wcag-contrast';
import { colors } from '@entur/tokens';
import { StrongText } from '@entur/typography';

import './ColorSwatch.scss';

type Props = {
  path: string;
  style?: any;
};

const ColorSwatch: React.FC<Props> = ({ children, path, style }) => {
  const backgroundColor = path
    .split('.')
    .reduce(
      (currentObject: any, key: string) =>
        currentObject ? currentObject[key] : null,
      colors,
    );

  const contrastWithWhite = hex(colors.brand.white, backgroundColor);
  const contrastWithBlue = hex(colors.brand.blue, backgroundColor);

  // This pretty piece of code makes sure we use the text color with the best
  // contrast,
  let foregroundColor =
    contrastWithWhite >= contrastWithBlue
      ? colors.brand.white
      : contrastWithBlue >= 4.5
      ? colors.brand.blue
      : colors.misc.black;

  const variableName =
    '$colors-' +
    path
      .replace(/\./g, '-') // replaces . with -
      .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2') // camelCase to kebab-case
      .toLowerCase();
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
