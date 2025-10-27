import React from 'react';

import { Heading, Text } from '@entur/typography/beta';

import './TypographyDisplay.scss';

type TypographyWeights = 300 | 400 | 500 | 600 | 700;

type TypographyDisplayProps = {
  weight: TypographyWeights;
  fontFamily?: string;
};

export function TypographyDisplay({
  weight,
  fontFamily = 'Nationale',
}: TypographyDisplayProps): React.ReactNode {
  function FontName() {
    switch (weight) {
      case 300:
        return 'Light';
      case 400:
        return 'Regular';
      case 500:
        return 'Medium';
      case 600:
        return 'DemiBold';
      case 700:
        return 'Bold';
    }
  }
  return (
    <>
      <Heading as="h4" variant="section-1">
        {fontFamily} {FontName()}
      </Heading>
      <div className="typography-display">
        <div className="typography-display__visualiser">
          <TypographyAlphabet weight={weight} fontFamily={fontFamily} />
          <TypographyAlphabet
            weight={weight}
            fontStyle="italic"
            fontFamily={fontFamily}
          />
        </div>
        <div className="typography-display__information">
          <div className="typography-display__information__text">
            <Text as="strong" weight="bold">
              {fontFamily} {FontName()}
            </Text>
            <div>
              <Text variant="sublabel">Vekt: </Text>
              <Text variant="subparagraph">{weight}</Text>
            </div>
            <div>
              <Text variant="sublabel">Stil: </Text>
              <Text variant="subparagraph">normal</Text>
            </div>
          </div>
          <div className="typography-display__information__text">
            <Text as="strong" weight="bold">
              {fontFamily} {FontName()} Italic
            </Text>
            <div>
              <Text variant="sublabel">Vekt: </Text>
              <Text variant="subparagraph">{weight}</Text>
            </div>
            <div>
              <Text variant="sublabel">Stil: </Text>
              <Text variant="subparagraph">kursiv</Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type TypographyAlphabetProps = {
  fontStyle?: 'normal' | 'italic';
  weight: TypographyWeights;
  fontFamily?: string;
};

function TypographyAlphabet({
  fontStyle = 'normal',
  weight,
  fontFamily,
}: TypographyAlphabetProps) {
  return (
    <div
      className="typography-alphabet-wrapper"
      style={{ fontFamily, fontWeight: weight, fontStyle }}
    >
      <div className="typography-alphabet--large">Aa</div>
      <div className="typography-alphabet-text">
        <span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
        <span>abcdefghijklmnopqrstuvwxyz</span>
        <span>1234567890(,.;:?!$&*)</span>
      </div>
    </div>
  );
}
