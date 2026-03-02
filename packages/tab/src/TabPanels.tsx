import React, { useContext } from 'react';
import classNames from 'classnames';

import { TabsContext } from './TabsContext';

export type TabPanelsProps = {
  /** Tab-panelene */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  [key: string]: any;
};

export const TabPanels: React.FC<TabPanelsProps> = ({
  className,
  as,
  children,
  ...rest
}) => {
  const { tabsId } = useContext(TabsContext);

  const Element: React.ElementType = as || 'div';

  return (
    <Element className={classNames('eds-tab-panels', className)} {...rest}>
      {React.Children.map(children, (child, idx) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              _tabIndex: idx,
              _tabId: `${tabsId}-tab-${idx}`,
              _panelId: `${tabsId}-panel-${idx}`,
            })
          : child,
      )}
    </Element>
  );
};
