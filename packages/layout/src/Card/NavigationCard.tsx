import React from 'react';
import { Paragraph } from '@entur/typography';
import classNames from 'classnames';
import { Heading3 } from '@entur/typography';
import { BaseCard } from './BaseCard';
import './NavigationCard.scss';
import { PolymorphicComponentProps } from '@entur/utils';

export type NavigationCardOwnProps = {
  /** HTML-elementet eller React-komponenten som lager NavigationCard
   * @default 'a'
   */
  as?: 'a' | 'button' | React.ElementType;
  /** Tittelen/teksten som står i CardBox */
  title: string;
  /** Valgfritt ikon som står over tittelen */
  titleIcon?: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Lager en mer kompakt NavigationCard, uten ikon og beskrivende tekst
   * @default false
   */
  compact?: boolean;
  /** Beskrivelse under tittel, om ikke "compact" er valgt */
  children?: React.ReactNode;
  /** Legger til et ikon for å symbolisere at kortet har en ekstern lenke
   * @default false
   */
};

export type NavigationCardProps<
  T extends React.ElementType = typeof defaultElement,
> = PolymorphicComponentProps<T, NavigationCardOwnProps>;

const defaultElement = 'a';

export const NavigationCard = <
  E extends React.ElementType = typeof defaultElement,
>({
  title,
  children,
  titleIcon,
  compact = false,
  className,
  as,
  ...rest
}: NavigationCardProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  const classList = classNames('eds-navigation-card', className, {
    'eds-base-card--red-line': compact,
    'eds-navigation-card--compact': compact,
  });
  return (
    <BaseCard as={Element} className={classList} {...rest}>
      <div className="eds-navigation-card-header">
        <div className="eds-navigation-card-header__content">
          {titleIcon && (
            <div
              className="eds-navigation-card-header__title-icon"
              aria-hidden="true"
            >
              {titleIcon}
            </div>
          )}
          <span className="eds-navigation-card-header__title">
            <Heading3 as="span">{title}</Heading3>
          </span>
        </div>
        <div className="eds-navigation-card-header__highlight"></div>
      </div>
      {!compact && (
        <>
          <Paragraph>{children}</Paragraph>
        </>
      )}
    </BaseCard>
  );
};
