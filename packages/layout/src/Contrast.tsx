import React from 'react';
import classNames from 'classnames';

export type ContrastProps = {
  /** HTML-elementet eller React-komponenten som rendres
   * @default 'div'
   */
  as?: string | React.ElementType;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const Contrast: React.FC<ContrastProps> = ({
  as: Element = 'div',
  className,
  ...rest
}) => {
  return (
    <ContrastContext.Provider value={true}>
      <Element className={classNames('eds-contrast', className)} {...rest} />
    </ContrastContext.Provider>
  );
};

const ContrastContext = React.createContext<boolean>(false);

export const useContrast = () => {
  const context = React.useContext(ContrastContext);
  if (!context) {
    return false;
  }
  return context;
};
