import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps } from '@entur/utils';
import { Heading, Text } from '@entur/typography/beta';
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
  ...rest
}: BaseCardProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
  const classList = classNames('designentur-base-card', className);
  return (
    <Element className={classList} {...rest}>
      <div className="designentur-base-card__content">
        {title && (
          <Heading
            as="headingLevel"
            variant="section-1"
            className="designentur-base-card__title"
          >
            {title}
          </Heading>
        )}

        {children && (
          <div className="designentur-base-card__children">{children}</div>
        )}
        {subText && (
          <Text
            variant="subparagraph"
            className="designentur-base-card__subtext"
          >
            {subText}
          </Text>
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
