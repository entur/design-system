import React from 'react';
import classNames from 'classnames';
import { Box, PolymorphicComponentProps } from '@entur/utils';
import './IconButton.scss';

export type IconButtonBaseProps = {
  /** Ikonet som du vil ha inne i knappen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Deaktivering av knappen
   * @default false
   */
  disabled?: boolean;
  /** HTML-elementet eller React-komponenten som lager knappen
   * @default 'button'
   */
  as?: React.ElementType;
  /**Størrelsen på knappen
   * @default "medium"
   */
  size?: 'small' | 'medium';
};

const defaultElement = 'button';

export type IconButtonProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, IconButtonBaseProps>;

export const IconButton: <E extends React.ElementType = typeof defaultElement>(
  props: IconButtonProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    {
      children,
      className,
      disabled = false,
      size,
      ...rest
    }: IconButtonProps<E>,
    ref: typeof rest.ref,
  ) => {
    return (
      <Box
        as={defaultElement}
        className={classNames(
          'eds-icon-button',
          className,
          {
            'eds-icon-button--disabled': disabled,
          },
          `eds-icon-button--size-${size}`,
        )}
        disabled={disabled}
        aria-disabled={disabled}
        ref={ref}
        {...rest}
      >
        {children}
      </Box>
    );
  },
);
