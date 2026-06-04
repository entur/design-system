import React, { useCallback, useContext, useRef } from 'react';
import classNames from 'classnames';

import { TabItemContext, TabsContext } from './TabsContext';

export type TabListProps = {
  /** Tab-komponenter */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | React.ElementType;
  width?: 'fluid';
  className?: string;
  /** Tilgjengelig navn på tab-listen (dersom det ikke finnes en synlig overskrift) */
  'aria-label'?: string;
  /** ID til elementet som navngir tab-listen */
  'aria-labelledby'?: string;
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>;

export const TabList: React.FC<TabListProps> = ({
  className,
  width,
  as,
  children,
  ...rest
}) => {
  const { tabsId } = useContext(TabsContext);
  const tabListRef = useRef<HTMLElement>(null);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
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
  }, []);

  const Element: React.ElementType = as || 'div';

  return (
    <Element
      role="tablist"
      tabIndex={-1}
      ref={tabListRef}
      className={classNames('eds-tab-list', className, {
        'eds-tab-list--width-fluid': width === 'fluid',
      })}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {React.Children.map(children, (child, idx) => (
        <TabItemContext.Provider
          value={{
            tabIndex: idx,
            tabId: `${tabsId}-tab-${idx}`,
            panelId: `${tabsId}-panel-${idx}`,
          }}
        >
          {child}
        </TabItemContext.Provider>
      ))}
    </Element>
  );
};
