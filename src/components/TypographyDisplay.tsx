import React from 'react';
import cx from 'classnames';
import './TypographyDisplay.scss';
type TypographyDisplayProps = {
  weight: 300 | 400 | 500 | 600;
};

function TypographyDisplay({ weight }: TypographyDisplayProps) {
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
    }
  }
  return (
    <>
      <div className="typography-display-header">Nationale {FontName()} </div>
      <div className="typography-display">
        <div className="typography-display-presenter">
          <TypographyAlphabet weight={weight} />
          <TypographyAlphabet weight={weight} italic />
        </div>
        <div className="typography-display-information">
          <div className="typography-display-information__text">
            <div style={{ fontWeight: 'bold' }}>Nationale {FontName()}</div>
            <div>
              <span className="typography-display-information__text-title">
                Weight:{' '}
              </span>
              {weight}
            </div>
            <div>
              <span className="typography-display-information__text-title">
                Style:{' '}
              </span>
              normal
            </div>
          </div>
          <div className="typography-display-information__text">
            <div style={{ fontWeight: 'bold' }}>
              Nationale {FontName()} Italic
            </div>
            <div>
              <span className="typography-display-information__text-title">
                Weight:{' '}
              </span>
              {weight}
            </div>
            <div>
              <span className="typography-display-information__text-title">
                Style:{' '}
              </span>
              italic
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type TypographyAlphabetProps = {
  italic?: boolean;
  weight: 300 | 400 | 500 | 600;
};

function TypographyAlphabet({ italic, weight }: TypographyAlphabetProps) {
  const classList = cx([
    'typography-alphabet-wrapper',
    {
      'typography-alphabet--italic': italic,
    },
    [`typography-alphabet--weight-${weight}`],
  ]);

  return (
    <div className={classList}>
      <div className="typography-alphabet--large">Aa</div>
      <div className="typography-alphabet-text">
        <span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
        <span>abcdefghijklmnopqrstuvwxyz</span>
        <span>1234567890(,.;:?!$&*)</span>
      </div>
    </div>
  );
}

export default TypographyDisplay;
