import React from 'react';
import { Heading3, Paragraph } from '@entur/typography';
import classNames from 'classnames';
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
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const CardBox: React.FC<CardProps> = ({
  as: Element = 'a',
  title,
  children,
  titleIcon,
  className,
  ...rest
}) => {
  const classList = classNames('eds-base-card', 'eds-card-box', className);
  return (
    <Element className={classList} {...rest}>
      {titleIcon && <div className="eds-card-box__title-icon">{titleIcon}</div>}
      <Heading3 as="span" className="eds-card-box__heading">
        {title}
      </Heading3>
      <Paragraph>{children}</Paragraph>
      <ForwardIcon className="eds-card-box__arrow-icon" />
    </Element>
  );
};
