import React, { useContext } from 'react';
import classNames from 'classnames';

import { useItemIndex } from './indexedItems';
import { TabsContext } from './TabsContext';

export type TabPanelProps = {
  /** Innholdet i tab-panelet */
  children?: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | React.ElementType;
  /** Indeksen til panelet. Settes vanligvis ut fra rekkefølgen i `TabPanels`,
   * men må angis manuelt dersom panelet ligger inne i en egen komponent */
  index?: number;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>;

export const TabPanel = ({
  className,
  as,
  index,
  children,
  ...rest
}: TabPanelProps) => {
  const { selectedIndex, tabsId } = useContext(TabsContext);
  const { index: tabIndex, keepMounted } = useItemIndex('panel', index);

  const isSelected = selectedIndex === tabIndex;
  const isHiddenButMounted = keepMounted && !isSelected;

  if (!isSelected && !keepMounted) return null;

  const Element: React.ElementType = as || 'div';

  return (
    <Element
      role="tabpanel"
      id={`${tabsId}-panel-${tabIndex}`}
      aria-labelledby={`${tabsId}-tab-${tabIndex}`}
      tabIndex={isSelected ? 0 : -1}
      hidden={isHiddenButMounted || undefined}
      className={classNames('eds-tab-panel', className)}
      {...rest}
    >
      {children}
    </Element>
  );
};
