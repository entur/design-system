import React from 'react';
import { Heading3 } from '@entur/typography';
import classNames from 'classnames';
import { ForwardIcon } from '@entur/icons';
import './CardTab.scss';
import './BaseCard.scss';

type CardProps = {
  /** HTML-elementet eller React-komponenten som lager CardTab */
  as?: 'a' | 'button' | React.ElementType;
  /** Tittelen/teksten som står i CardTab */
  title: string;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const CardTab: React.FC<CardProps> = ({
  as: Element = 'a',
  title,
  className,
  ...rest
}) => {
  const classList = classNames('entur-base-card', 'entur-card-tab', className);
  return (
    <Element className={classList} {...rest}>
      <Heading3 as="span" className="entur-card-tab__heading">
        {title}
      </Heading3>
      <ForwardIcon inline className="entur-card-tab__arrow-icon" />
    </Element>
  );
};
