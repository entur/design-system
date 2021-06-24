import { GridItem } from '@entur/grid';
import { Heading3, Paragraph } from '@entur/typography';
import React from 'react';
import './DesignPrinciple.scss';

type DesignPrincipleProps = {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
};

export const DesignPrinciple: React.FC<DesignPrincipleProps> = ({
  number,
  icon,
  title,
  description,
}) => {
  return (
    <GridItem small={12} medium={4} className="design-principle__container">
      <div className="design-principle__number">{number}.</div>
      <div className="design-principle__icon">{icon}</div>
      <Heading3 className="design-principle__title">{title} </Heading3>
      <Paragraph className="design-principle__description">
        {description}{' '}
      </Paragraph>
    </GridItem>
  );
};
