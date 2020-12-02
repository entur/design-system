import React from 'react';
import { Button } from './Button';
import { PolymorphicComponentProps } from '@entur/utils';

export type TertiaryButtonBaseProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Deaktivering av knappen
   * @default false
   */
  disabled?: boolean;
  /** Innholdet i knappen */
  children: React.ReactNode;
};

export type TertiaryButtonProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, TertiaryButtonBaseProps>;

const defaultElement = 'button';

export const TertiaryButton: <E extends React.ElementType = typeof defaultElement>(
  props: TertiaryButtonProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    props: TertiaryButtonProps<E>,
    ref: typeof props.ref,
  ) => <Button as={defaultElement} {...props} ref={ref} variant="tertiary" />,
);
