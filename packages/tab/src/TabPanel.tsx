import React, { useContext } from 'react';
import classNames from 'classnames';

import { TabsContext } from './TabsContext';

export type TabPanelProps = {
  /** Overskriften til taben */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  /** @internal Injected by TabPanels */
  _tabIndex?: number;
  /** @internal Injected by TabPanels */
  _tabId?: string;
  /** @internal Injected by TabPanels */
  _panelId?: string;
  [key: string]: any;
};

export const TabPanel: React.FC<TabPanelProps> = ({
  className,
  as,
  _tabIndex = 0,
  _tabId,
  _panelId,
  children,
  ...rest
}) => {
  const { selectedIndex } = useContext(TabsContext);
  const isSelected = selectedIndex === _tabIndex;

  if (!isSelected) return null;

  const Element: React.ElementType = as || 'div';

  return (
    <Element
      role="tabpanel"
      id={_panelId}
      aria-labelledby={_tabId}
      className={classNames('eds-tab-panel', className)}
      {...rest}
    >
      {children}
    </Element>
  );
};
