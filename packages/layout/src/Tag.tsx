import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';
import { VariantType } from '@entur/utils';
import { warnOnce } from './warnOnce';
import './Tag.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const danger = 'danger';

export type TagOwnProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default 'div'
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  /** Hvilken variant Tag man vil ha
   * @default "neutral"
   */
  variant?: 'primary' | 'neutral' | VariantType | typeof danger | typeof info;
  /** Velg størrelse på Tag
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  /** @deprecated Bruk `size="small"` i stedet */
  compact?: boolean;
  children: React.ReactNode;
};

export type TagProps<T extends React.ElementType = typeof defaultElement> =
  PolymorphicComponentPropsWithRef<T, TagOwnProps>;

export type TagComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: TagProps<T>,
) => React.ReactElement | null;

const defaultElement = 'div';

export const Tag: TagComponent = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    {
      className,
      children,
      compact,
      variant = 'neutral',
      size: sizeProp,
      as,
      ...rest
    }: TagProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    if (compact !== undefined) {
      warnOnce(
        'Tag-compact',
        '[Entur Linje] The `compact` prop on Tag is deprecated. Use `size="small"` instead.',
      );
    }

    const size = sizeProp ?? (compact ? 'small' : 'medium');

    const Element: React.ElementType = as || defaultElement;
    const childrenArray = React.Children.toArray(children);
    const hasLeadingIcon =
      childrenArray.length > 1 &&
      typeof childrenArray[0] !== 'string' &&
      typeof childrenArray[0] !== 'number';
    const hasTrailingIcon =
      childrenArray.length > 1 &&
      typeof childrenArray[childrenArray.length - 1] !== 'string' &&
      typeof childrenArray[childrenArray.length - 1] !== 'number';

    return (
      <Element
        className={classNames(
          'eds-tag',
          `eds-tag--variant-${variant}`,
          `eds-tag--size-${size}`,
          {
            'eds-tag--leading-icon': hasLeadingIcon,
            'eds-tag--trailing-icon': hasTrailingIcon,
          },
          className,
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </Element>
    );
  },
);
