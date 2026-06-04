import React, { useContext } from 'react';
import classNames from 'classnames';

import { TabPanelItemContext, TabsContext } from './TabsContext';

export type TabPanelProps = {
  /** Innholdet i tab-panelet */
  children?: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | React.ElementType;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>;

export const TabPanel: React.FC<TabPanelProps> = ({
  className,
  as,
  children,
  ...rest
}) => {
  const { selectedIndex } = useContext(TabsContext);
  const itemContext = useContext(TabPanelItemContext);
  const tabIndex = itemContext?.tabIndex ?? 0;
  const keepMounted = itemContext?.keepMounted ?? false;

  const isSelected = selectedIndex === tabIndex;
  const isHiddenButMounted = keepMounted && !isSelected;

  if (!isSelected && !keepMounted) return null;

  const Element: React.ElementType = as || 'div';

  return (
    <Element
      role="tabpanel"
      id={itemContext?.panelId}
      aria-labelledby={itemContext?.tabId}
      tabIndex={isSelected ? 0 : -1}
      hidden={isHiddenButMounted || undefined}
      className={classNames('eds-tab-panel', className)}
      {...rest}
    >
      {children}
    </Element>
  );
};
