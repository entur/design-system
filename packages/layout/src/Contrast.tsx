import React from 'react';
import classNames from 'classnames';
import {
  PolymorphicPropsWithoutRef,
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithRef,
} from '@entur/utils';

export type ContrastBaseProps = {
  /** Ekstra klassenavn */
  className?: string;
};

export type ContrastProps<
  E extends React.ElementType = typeof defaultElement
> = PolymorphicPropsWithRef<ContrastBaseProps, E>;

const defaultElement = 'div';

export const Contrast: PolymorphicForwardRefExoticComponent<
  ContrastBaseProps,
  typeof defaultElement
> = React.forwardRef(function Contrast<
  T extends React.ElementType = typeof defaultElement
>(
  { className, as, ...rest }: PolymorphicPropsWithoutRef<ContrastBaseProps, T>,
  ref: React.ForwardedRef<React.ElementRef<T>>,
) {
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

const ContrastContext = React.createContext<boolean>(false);

export const useContrast = () => React.useContext(ContrastContext);
