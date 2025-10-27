import { GridItem } from '@entur/grid';
import { Heading, Text } from '@entur/typography/beta';
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
    <GridItem
      small={12}
      medium={6}
      large={4}
      className="design-principle__container"
    >
      <div aria-hidden="true" className="design-principle__number">
        {number}.
      </div>
      <div aria-hidden="true" className="design-principle__icon">
        {icon}
      </div>
      <Heading as="h3" variant="subtitle-1" aria-label={`${number}. ${title}`}>
        {title}
      </Heading>
      <Text variant="paragraph" className="design-principle__description">
        {description}{' '}
      </Text>
    </GridItem>
  );
};
