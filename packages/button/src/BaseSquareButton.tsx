import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps, Box } from '@entur/utils';
import './BaseSquareButton.scss';
import './LoadingSpinner.scss';

export type BaseSquareButtonBaseProps = {
  /** Tekst og ikon */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** En type knapp */
  variant: 'success' | 'secondary';
  /** Deaktivering av knappen
   * @default false
   */
  disabled?: boolean;
  /** Om knappen er opptatt, f.eks. med å lagre eller å kjøpe
   * @default false
   */
  loading?: boolean;
};

export type BaseSquareButtonProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, BaseSquareButtonBaseProps>;

const defaultElement = 'button';

export const BaseSquareButton: <E extends React.ElementType = typeof defaultElement>(
  props: BaseSquareButtonProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    {
      children,
      className,
      variant,
      disabled = false,
      loading = false,
      ...rest
    }: BaseSquareButtonProps<E>,
    ref: typeof rest.ref,
  ) => {
    return (
      <Box
        as={defaultElement}
        className={classNames(
          'eds-square-button',
          { 'eds-square-button--success': variant === 'success' },
          { 'eds-square-button--secondary': variant === 'secondary' },
          { 'eds-square-button--loading': loading },
          className,
        )}
        aria-busy={loading}
        disabled={disabled}
        aria-disabled={disabled}
        ref={ref}
        {...rest}
      >
        {React.Children.map(children, child => {
          if (typeof child === 'string') {
            return <span className="eds-square-button__label">{child}</span>;
          }
          return (
            <span className="eds-square-button__icon">
              {loading ? <div className="eds-button__spinner" /> : child}
            </span>
          );
        })}
      </Box>
    );
  },
);
