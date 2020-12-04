import React from 'react';
import { Button } from './Button';
import { PolymorphicComponentProps } from '@entur/utils';

type SuccessButtonBaseProps = {
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
  /** Bredden på knappen
   * @default 'auto'
   */
  width?: 'fluid' | 'auto';
  /** Innholdet i knappen */
  children: React.ReactNode;
};

export type SuccessButtonProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, SuccessButtonBaseProps>;

const defaultElement = 'button';

export const SuccessButton: <E extends React.ElementType = typeof defaultElement>(
  props: SuccessButtonProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    props: SuccessButtonProps<E>,
    ref: typeof props.ref,
  ) => <Button as={defaultElement} {...props} ref={ref} variant="success" />,
);
