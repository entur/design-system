import React from 'react';
import { SecondaryButton, ButtonGroup } from '@entur/button';
import { DownloadIcon } from '@entur/icons';
import { Heading2 } from '@entur/typography';
import './GuidelinesBlock.scss';

type GuidelinesBlockProps = {
  title: string;
  children: React.ReactNode;
  downloadSourceButton?: String;
};

export const GuidelinesBlock: React.FC<GuidelinesBlockProps> = ({
  title = 'Veiledning til bruk',
  children,
  downloadSourceButton,
}) => {
  return (
    <div className="guidelines-block__container">
      <div className="guidelines-block__header">
        <Heading2 className="guidelines-block__title">{title}</Heading2>
        {downloadSourceButton && (
          <div className="guidelines-block__download">
            <ButtonGroup>
              <SecondaryButton size="small">
                <DownloadIcon /> Last ned som PDF
              </SecondaryButton>
            </ButtonGroup>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};
