import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import { useRandomId } from '@entur/utils';

import { TabsContext } from './TabsContext';

export type TabsProps = {
  /** Overskriften til taben */
  children: React.ReactNode;
  /** Kalles når taben endres */
  onChange?: (index: number) => void;
  /** Hvilken tab som skal være åpen by default */
  defaultIndex?: number;
  /** Den åpne indexen */
  index?: number;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;

  [key: string]: any;
};

export const Tabs: React.FC<TabsProps> = ({
  className,
  index,
  defaultIndex,
  onChange,
  as,
  children,
  ...rest
}) => {
  const [internalIndex, setInternalIndex] = useState(defaultIndex ?? 0);
  const isControlled = index !== undefined;
  const selectedIndex = isControlled ? index : internalIndex;
  const tabsId = useRandomId('eds-tabs');

  const onSelect = useCallback(
    (i: number) => {
      if (!isControlled) {
        setInternalIndex(i);
      }
      onChange?.(i);
    },
    [isControlled, onChange],
  );

  const Element: React.ElementType = as || 'div';

  return (
    <TabsContext.Provider value={{ selectedIndex, onSelect, tabsId }}>
      <Element className={classNames('eds-tabs', className)} {...rest}>
        {children}
      </Element>
    </TabsContext.Provider>
  );
};
