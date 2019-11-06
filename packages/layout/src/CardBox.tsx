import React from 'react';
import { Heading3, Paragraph } from '@entur/typography';
import { ForwardIcon } from '@entur/icons';
import './CardBox.scss';
import './BaseCard.scss';

type CardProps = {
  /** HTML-elementet eller React-komponenten som lager CardBox */
  as?: 'a' | 'button' | React.ElementType;
  /** Tittelen/teksten som står i CardBox */
  title: string;
  /** Valgfritt ikon som står over tittelen */
  titleIcon?: React.ReactNode;
  [key: string]: any;
};

export const CardBox: React.FC<CardProps> = ({
  as: Element = 'a',
  title,
  children,
  titleIcon,
  ...rest
}) => {
  return (
    <Element className="entur-base-card entur-card-box" {...rest}>
      {titleIcon && (
        <div className="entur-card-box__title-icon">{titleIcon}</div>
      )}
      <Heading3 as="span" className="entur-card-box__heading">
        {title}
      </Heading3>
      <Paragraph>{children}</Paragraph>
      <ForwardIcon className="entur-card-box__arrow-icon" />
    </Element>
  );
};
