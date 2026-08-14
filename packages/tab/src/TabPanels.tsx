import React, { useContext } from 'react';
import classNames from 'classnames';

import { useIndexedChildren } from './indexedItems';
import { TabsContext } from './TabsContext';

export type TabPanelsProps = {
  /** Tab-panelene */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | React.ElementType;
  /** Behold alle panel-noder i DOM (skjult med hidden-attributt) i stedet for å avmontere */
  keepMounted?: boolean;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>;

export const TabPanels = ({
  className,
  as,
  keepMounted = false,
  children,
  ...rest
}: TabPanelsProps) => {
  const { selectedIndex, reportIndices } = useContext(TabsContext);

  const items = useIndexedChildren('panel', children, {
    selectedIndex,
    keepMounted,
    onIndices: indices => reportIndices('panel', indices),
  });

  const Element: React.ElementType = as || 'div';

  return (
    <Element className={classNames('eds-tab-panels', className)} {...rest}>
      {items}
    </Element>
  );
};
