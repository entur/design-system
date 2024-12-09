import React from 'react';

import { Heading5, SmallText, StrongText, SubLabel } from '@entur/typography';

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
      <Heading5 as="h4">
        {fontFamily} {FontName()}
      </Heading5>
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
            <StrongText>
              {fontFamily} {FontName()}
            </StrongText>
            <div>
              <SubLabel>Vekt: </SubLabel>
              <SmallText>{weight}</SmallText>
            </div>
            <div>
              <SubLabel>Stil: </SubLabel>
              <SmallText>normal</SmallText>
            </div>
          </div>
          <div className="typography-display__information__text">
            <StrongText>
              {fontFamily} {FontName()} Italic
            </StrongText>
            <div>
              <SubLabel>Vekt: </SubLabel>
              <SmallText>{weight}</SmallText>
            </div>
            <div>
              <SubLabel>Stil: </SubLabel>
              <SmallText>kursiv</SmallText>
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
