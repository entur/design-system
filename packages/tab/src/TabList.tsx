import React, { useCallback, useContext, useRef } from 'react';
import classNames from 'classnames';
import { getActiveElement } from '@entur/utils';

import { useIndexedChildren } from './indexedItems';
import { TabsContext } from './TabsContext';

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

export const TabList = ({
  className,
  width,
  as,
  children,
  ...rest
}: TabListProps) => {
  const { reportIndices } = useContext(TabsContext);
  const tabListRef = useRef<HTMLElement>(null);

  const items = useIndexedChildren('tab', children, {
    onIndices: indices => reportIndices('tab', indices),
  });

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const tabs = Array.from(
      tabListRef.current?.querySelectorAll<HTMLElement>(
        '[role="tab"]:not([disabled]):not([aria-disabled="true"])',
      ) ?? [],
    );
    const focusedElement = getActiveElement();
    const current = tabs.findIndex(tab => tab === focusedElement);
    if (current === -1) return;

    const next = {
      ArrowRight: (current + 1) % tabs.length,
      ArrowLeft: (current - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[e.key];
    if (next === undefined) return;

    e.preventDefault();
    tabs[next].focus();
    tabs[next].click();
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
      {...rest}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        rest.onKeyDown?.(e);
        handleKeyDown(e);
      }}
    >
      {items}
    </Element>
  );
};
