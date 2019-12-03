import React from 'react';
import { Heading3, Paragraph } from '@entur/typography';
import classNames from 'classnames';
import { ForwardIcon } from '@entur/icons';
import { BaseCard } from './BaseCard';
import './NavigationCard.scss';

export type NavigationCardProps = {
  /** HTML-elementet eller React-komponenten som lager NavigationCard */
  as?: 'a' | 'button' | React.ElementType;
  /** Tittelen/teksten som står i CardBox */
  title: string;
  /** Valgfritt ikon som står over tittelen */
  titleIcon?: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Lager en mer kompakt NavigationCard, uten ikon og beskrivende tekst */
  compact?: boolean;
  /** Beskrivelse under tittel, om ikke "compact" er valgt */
  children?: React.ReactNode;
  [key: string]: any;
};

export const NavigationCard: React.FC<NavigationCardProps> = ({
  as = 'a',
  title,
  children,
  titleIcon,
  compact = false,
  className,
  ...rest
}) => {
  const classList = classNames(
    'eds-base-card',
    'eds-navigation-card',
    className,
    {
      'eds-navigation-card--compact': compact,
    },
  );
  return (
    <BaseCard as={as} className={classList} {...rest}>
      {!compact && titleIcon && (
        <div className="eds-navigation-card__title-icon">{titleIcon}</div>
      )}
      <Heading3 as="span" margin={compact ? 'both' : 'top'}>
        {title}
      </Heading3>
      {!compact && <Paragraph>{children}</Paragraph>}
      <ForwardIcon
        inline={compact}
        className="eds-navigation-card__arrow-icon"
      />
    </BaseCard>
  );
};
