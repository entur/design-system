import React from 'react';
import { Button } from './Button';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';

export type TertiaryButtonBaseProps = {
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

export type TertiaryButtonProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, TertiaryButtonBaseProps>;

export type TertiaryButtonComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: TertiaryButtonProps<T>,
) => React.ReactElement | null;

const defaultElement = 'button';

/** @deprecated use SecondaryButton size="small" instead */
export const TertiaryButton: TertiaryButtonComponent = React.forwardRef(
  <T extends React.ElementType = typeof defaultElement>(
    props: TertiaryButtonProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element: React.ElementType = props.as || defaultElement;
    return (
      <Button
        as={Element}
        {...props}
        ref={ref}
        variant="tertiary"
        size="small"
      />
    );
  },
);
