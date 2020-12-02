import React from 'react';
import { Button } from './Button';
import { PolymorphicComponentProps } from '@entur/utils';

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

export type PrimaryButtonProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, PrimaryButtonBaseProps>;

const defaultElement = 'button';

export const PrimaryButton: <E extends React.ElementType = typeof defaultElement>(
  props: PrimaryButtonProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    props: PrimaryButtonProps<E>,
    ref: typeof props.ref,
  ) => <Button as={defaultElement} {...props} ref={ref} variant="primary" />,
);
