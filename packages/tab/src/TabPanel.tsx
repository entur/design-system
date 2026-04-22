import React, { useContext } from 'react';
import classNames from 'classnames';

import { TabsContext } from './TabsContext';

export type TabPanelProps = {
  /** Innholdet i tab-panelet */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  /** @internal Injected by TabPanels */
  _tabIndex?: number;
  /** @internal Injected by TabPanels */
  _tabId?: string;
  /** @internal Injected by TabPanels */
  _panelId?: string;
  /** @internal Injected by TabPanels */
  _unmountOnChange?: boolean;
  [key: string]: any;
};

export const TabPanel: React.FC<TabPanelProps> = ({
  className,
  as,
  _tabIndex = 0,
  _tabId,
  _panelId,
  _unmountOnChange = false,
  children,
  ...rest
}) => {
  const { selectedIndex } = useContext(TabsContext);
  const isSelected = selectedIndex === _tabIndex;

  if (_unmountOnChange && !isSelected) return null;

  const Element: React.ElementType = as || 'div';

  return (
    <Element
      role="tabpanel"
      id={_panelId}
      aria-labelledby={_tabId}
      tabIndex={0}
      hidden={!isSelected}
      className={classNames('eds-tab-panel', className)}
      {...rest}
    >
      {children}
    </Element>
  );
};
