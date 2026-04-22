import React, { useContext } from 'react';
import classNames from 'classnames';

import { TabsContext } from './TabsContext';

export type TabPanelsProps = {
  /** Tab-panelene */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  /** Om innholdet i paneler skal avmonteres når de ikke er valgt */
  unmountOnChange?: boolean;
  [key: string]: any;
};

export const TabPanels: React.FC<TabPanelsProps> = ({
  className,
  as,
  unmountOnChange = false,
  children,
  ...rest
}) => {
  const { tabsId } = useContext(TabsContext);

  const Element: React.ElementType = as || 'div';

  return (
    <Element className={classNames('eds-tab-panels', className)} {...rest}>
      {React.Children.map(children, (child, idx) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              _tabIndex: idx,
              _tabId: `${tabsId}-tab-${idx}`,
              _panelId: `${tabsId}-panel-${idx}`,
              _unmountOnChange: unmountOnChange,
            })
          : child,
      )}
    </Element>
  );
};
