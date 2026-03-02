import React, { useContext } from 'react';
import classNames from 'classnames';

import { TabsContext } from './TabsContext';

export type TabProps = {
  /** Overskriften til taben */
  children: React.ReactNode;
  /** Om taben er disabled eller ikke */
  disabled?: boolean;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  removeActiveLine?: boolean;
  /** @internal Injected by TabList */
  _tabIndex?: number;
  /** @internal Injected by TabList */
  _tabId?: string;
  /** @internal Injected by TabList */
  _panelId?: string;
  [key: string]: any;
};

export const Tab: React.FC<TabProps> = ({
  className,
  removeActiveLine = false,
  as,
  disabled = false,
  _tabIndex = 0,
  _tabId,
  _panelId,
  children,
  ...rest
}) => {
  const { selectedIndex, onSelect } = useContext(TabsContext);
  const isSelected = selectedIndex === _tabIndex;
  const Element: React.ElementType = as || 'button';

  return (
    <Element
      role="tab"
      type={as ? undefined : 'button'}
      id={_tabId}
      aria-selected={isSelected}
      aria-controls={_panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled}
      className={classNames(
        'eds-tab',
        { 'eds-tab--remove-active-line': removeActiveLine },
        className,
      )}
      onClick={() => onSelect(_tabIndex)}
      {...rest}
    >
      {children}
    </Element>
  );
};
