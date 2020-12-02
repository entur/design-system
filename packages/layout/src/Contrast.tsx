import React from 'react';
import classNames from 'classnames';
import { PolymorphicComponentProps, Box } from 'react-polymorphic-box';

export type ContrastBaseProps = {
  /** Ekstra klassenavn */
  className?: string;
};

export type ContrastProps<
  E extends React.ElementType
> = PolymorphicComponentProps<E, ContrastBaseProps>;

const defaultElement = 'div';

export const Contrast: <E extends React.ElementType = typeof defaultElement>(
  props: ContrastProps<E>,
) => React.ReactElement | null = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    { className, ...rest }: ContrastProps<E>,
    ref: typeof rest.ref,
  ) => {
    return (
      <ContrastContext.Provider value={true}>
        <Box
          as={defaultElement}
          className={classNames('eds-contrast', className)}
          ref={ref}
          {...rest}
        />
      </ContrastContext.Provider>
    );
  },
);

const ContrastContext = React.createContext<boolean>(false);

export const useContrast = () => React.useContext(ContrastContext);
