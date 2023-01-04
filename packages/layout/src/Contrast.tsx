import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';

export type ContrastBaseProps = {
  /** Ekstra klassenavn */
  className?: string;
};

export type ContrastProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, ContrastBaseProps>;

export type ContrastComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: ContrastProps<T>,
) => React.ReactElement | null;

const defaultElement = 'div';

export const Contrast: ContrastComponent = React.forwardRef(function Contrast<
  T extends React.ElementType = typeof defaultElement,
>(
  { className, as, ...rest }: ContrastProps<T>,
  ref: PolymorphicRef<T>,
): JSX.Element {
  const Element: React.ElementType = as || defaultElement;
  return (
    <ContrastContext.Provider value={true}>
      <Element
        className={classNames('eds-contrast', className)}
        ref={ref}
        {...rest}
      />
    </ContrastContext.Provider>
  );
});

export const ContrastContext = React.createContext<boolean>(false);

export const useContrast: () => boolean = () =>
  React.useContext(ContrastContext);
