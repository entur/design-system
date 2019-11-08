import React from 'react';
import cx from 'classnames';
import './TypographyDisplay.scss';
type TypographyDisplayProps = {
  bold?: boolean;
};

function TypographyDisplay({ bold }: TypographyDisplayProps) {
  return (
    <>
      <div className="typography-display-header">
        Nationale {bold ? 'DemiBold' : 'Medium'}{' '}
      </div>
      <div className="typography-display">
        <div className="typography-display-presenter">
          <TypographyAlphabet bold={bold} />
          <TypographyAlphabet bold={bold} italic />
        </div>
        <div className="typography-display-information">
          <div className="typography-display-information--text">
            <div style={{ fontWeight: 'bold' }}>
              Nationale {bold ? 'DemiBold' : 'Medium'} Normal
            </div>
            <div>
              <span className="typography-display-information--text__field">
                Weigth:{' '}
              </span>
              {bold ? '600' : '500'}
            </div>
            <div>
              <span className="typography-display-information--text__field">
                Style:{' '}
              </span>
              normal
            </div>
          </div>
          <div className="typography-display-information--text">
            <div style={{ fontWeight: 'bold' }}>
              Nationale {bold ? 'DemiBold' : 'Medium'} Italic
            </div>
            <div>
              <span className="typography-display-information--text__field">
                Weigth:{' '}
              </span>
              {bold ? '600' : '500'}
            </div>
            <div>
              <span className="typography-display-information--text__field">
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
  bold?: boolean;
};

function TypographyAlphabet({ italic, bold }: TypographyAlphabetProps) {
  const classList = cx([
    'typography-alphabet-wrapper',
    {
      'typography-alphabet-bold': bold,
      'typography-alphabet-italic': italic,
    },
  ]);

  return (
    <div className={classList}>
      <div className="typography-alphabet-large">Aa</div>
      <div className="typography-alphabet-text">
        <span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span>
        <span>abcdefghijklmnopqrstuvwxyz</span>
        <span>1234567890(,.;:?!$&*)</span>
      </div>
    </div>
  );
}

export default TypographyDisplay;
