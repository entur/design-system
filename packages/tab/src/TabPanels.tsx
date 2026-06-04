import React, { useContext } from 'react';
import classNames from 'classnames';

import { TabPanelItemContext, TabsContext } from './TabsContext';

export type TabPanelsProps = {
  /** Tab-panelene */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | React.ElementType;
  /** Behold alle panel-noder i DOM (skjult med hidden-attributt) i stedet for å avmontere */
  keepMounted?: boolean;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>;

export const TabPanels: React.FC<TabPanelsProps> = ({
  className,
  as,
  keepMounted = false,
  children,
  ...rest
}) => {
  const { tabsId } = useContext(TabsContext);

  const Element: React.ElementType = as || 'div';

  return (
    <Element className={classNames('eds-tab-panels', className)} {...rest}>
      {React.Children.map(children, (child, idx) => (
        <TabPanelItemContext.Provider
          value={{
            tabIndex: idx,
            tabId: `${tabsId}-tab-${idx}`,
            panelId: `${tabsId}-panel-${idx}`,
            keepMounted,
          }}
        >
          {child}
        </TabPanelItemContext.Provider>
      ))}
    </Element>
  );
};
