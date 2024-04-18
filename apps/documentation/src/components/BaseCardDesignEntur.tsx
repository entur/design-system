import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { Heading5, SmallText } from '@entur/typography';
import { DownwardIcon } from '@entur/icons';

import './BaseCardDesignEntur.scss';

export type BaseCardOwnProps = {
  /** HTML-elementet eller React-komponenten som lager Card
   * @default "div"
   */
  as?: 'div' | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  children?: React.ReactNode;
  src?: string;
  alt?: string;
  subText?: string;
  title?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  arrow?: boolean;
  imageBorderTop?: boolean;
  imageBorderBottom?: boolean;
  minHeight?: string;
};

export type BaseCardProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentProps<T, BaseCardOwnProps>;

const defaultElement = 'div';

const BaseCardDesignEntur = <
  E extends React.ElementType = typeof defaultElement,
>({
  children,
  className,
  subText,
  title,
  as,
  headingLevel = 'h2',
  arrow = false,
  imageBorderTop = false,
  imageBorderBottom = false,
  ...rest
}: BaseCardProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  const classList = classNames('designentur-base-card', className);
  return (
    <Element className={classList} {...rest}>
      <div className="designentur-base-card__content">
        {title && (
          <Heading5 as={headingLevel} className="designentur-base-card__title">
            {title}
          </Heading5>
        )}

        {children && (
          <div
            className={classNames('designentur-base-card__children', {
              'designentur-base-card__image-border--top': imageBorderTop,
              'designentur-base-card__image-border--bottom': imageBorderBottom,
            })}
          >
            {children}
          </div>
        )}
        {subText && (
          <SmallText className="designentur-base-card__subtext">
            {subText}
          </SmallText>
        )}
      </div>
      {arrow && (
        <div className="designentur-base-card__arrow">
          <DownwardIcon size="24" />
        </div>
      )}
    </Element>
  );
};

export default BaseCardDesignEntur;
