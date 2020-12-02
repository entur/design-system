import React from 'react';
import cx from 'classnames';
import { Box, PolymorphicComponentProps } from '@entur/utils';
import './Button.scss';
import './LoadingSpinner.scss';

type ButtonBaseProps = {
  /** Farge og uttrykk på knappen */
  variant: 'primary' | 'secondary' | 'success' | 'negative' | 'tertiary';
  /** Størrelsen på knappen
   * @default 'medium'
   */
  size?: 'medium' | 'large';
  /** Om knappen er opptatt, f.eks. med å lagre eller å kjøpe
   * @default false
   */
  loading?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** Deaktivering av knappen
   * @default false
   */
  disabled?: boolean;
  /** Bredden på knappen.
   * @default 'auto'
   */
  width?: 'fluid' | 'auto';
  /** Innholdet i knappen */
  children: React.ReactNode;
};

export type ButtonProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, ButtonBaseProps>;

const defaultElement = 'button';

export const Button: <E extends React.ElementType = typeof defaultElement>(
  props: ButtonProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    {
      variant,
      size = 'medium',
      loading,
      className,
      children,
      disabled = false,
      width = 'auto',
      ...rest
    }: ButtonProps<E>,
    ref: typeof rest.ref,
  ) => {
    const childrenArray = React.Children.toArray(children);
    const hasLeadingIcon =
      childrenArray.length > 1 && typeof childrenArray[0] !== 'string';
    const hasTrailingIcon =
      childrenArray.length > 1 &&
      typeof childrenArray[childrenArray.length - 1] !== 'string';

    return (
      <Box
        as={defaultElement}
        className={cx(
          'eds-button',
          {
            [`eds-button--variant-${variant}`]: variant,
            [`eds-button--size-${size}`]: size,
            'eds-button--width-fluid': width === 'fluid',
            'eds-button--loading': loading,
            'eds-button--leading-icon': hasLeadingIcon,
            'eds-button--trailing-icon': hasTrailingIcon,
          },
          className,
        )}
        ref={ref}
        aria-busy={loading}
        disabled={disabled}
        aria-disabled={disabled}
        {...rest}
      >
        {loading ? <div className="eds-button__spinner" /> : children}
      </Box>
    );
  },
);
