import React from 'react';
import { Button } from './Button';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';

export type PrimaryButtonBaseProps = {
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

export type PrimaryButtonProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, PrimaryButtonBaseProps>;

export type PrimaryButtonComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: PrimaryButtonProps<T>,
) => React.ReactElement | null;

const defaultElement = 'button';

export const PrimaryButton: PrimaryButtonComponent = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: PrimaryButtonProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element: React.ElementType = props.as || defaultElement;
    // @ts-expect-error type error due to props not being BaseButtonProps
    return <Button as={Element} {...props} ref={ref} variant="primary" />;
  },
);
