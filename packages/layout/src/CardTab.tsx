import React from 'react';
import { Heading3 } from '@entur/typography';
import classNames from 'classnames';
import { ForwardIcon } from '@entur/icons';
import './CardTab.scss';
import './BaseCard.scss';

export type CardTabProps = {
  /** HTML-elementet eller React-komponenten som lager CardTab */
  as?: 'a' | 'button' | React.ElementType;
  /** Tittelen/teksten som står i CardTab */
  title: string;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const CardTab: React.FC<CardTabProps> = ({
  as: Element = 'a',
  title,
  className,
  ...rest
}) => {
  const classList = classNames('eds-base-card', 'eds-card-tab', className);
  return (
    <Element className={classList} {...rest}>
      <Heading3 as="span" className="eds-card-tab__heading">
        {title}
      </Heading3>
      <ForwardIcon inline className="eds-card-tab__arrow-icon" />
    </Element>
  );
};
