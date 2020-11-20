import React from 'react';
import classNames from 'classnames';

export type ContrastProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default 'div'
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
};

export const Contrast = React.forwardRef<HTMLDivElement, ContrastProps>(
  (
    { as: Element = 'div', className, ...rest },
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <ContrastContext.Provider value={true}>
        <Element
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
