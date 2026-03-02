import React, { useRef, useCallback, useContext } from 'react';
import classNames from 'classnames';

import { TabsContext } from './TabsContext';

export type TabListProps = {
  /** Tab-komponenter */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  width?: 'fluid';
  [key: string]: any;
};

export const TabList: React.FC<TabListProps> = ({
  className,
  width,
  as,
  children,
  ...rest
}) => {
  const { tabsId } = useContext(TabsContext);
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const tabs = tabListRef.current?.querySelectorAll<HTMLElement>(
        '[role="tab"]:not([disabled])',
      );
      if (!tabs || tabs.length === 0) return;

      const currentIndex = Array.from(tabs).findIndex(
        tab => tab === document.activeElement,
      );
      if (currentIndex === -1) return;

      let nextIndex: number | undefined;
      switch (e.key) {
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % tabs.length;
          break;
        case 'ArrowLeft':
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = tabs.length - 1;
          break;
      }

      if (nextIndex !== undefined) {
        e.preventDefault();
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      }
    },
    [],
  );

  const Element: React.ElementType = as || 'div';

  return (
    <Element
      role="tablist"
      ref={tabListRef}
      className={classNames('eds-tab-list', className, {
        'eds-tab-list--width-fluid': width === 'fluid',
      })}
      onKeyDown={handleKeyDown}
      {...rest}
    >
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
