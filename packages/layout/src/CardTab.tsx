import React from 'react';
import { Heading3 } from '@entur/typography';
import { ForwardIcon } from '@entur/icons';
import './CardTab.scss';
import './BaseCard.scss';

type CardProps = {
  /** HTML-elementet eller React-komponenten som lager CardTab */
  as?: 'a' | 'button' | React.ElementType;
  /** Tittelen/teksten som står i CardTab */
  title: string;
  [key: string]: any;
};

export const CardTab: React.FC<CardProps> = ({
  as: Element = 'a',
  title,
  ...rest
}) => {
  return (
    <Element className="entur-base-card entur-card-tab" {...rest}>
      <Heading3 as="span" className="entur-card-tab__heading">
        {title}
      </Heading3>
      <ForwardIcon inline className="entur-card-tab__arrow-icon" />
    </Element>
  );
};
