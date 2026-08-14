import React, { useContext } from 'react';
import classNames from 'classnames';

import { useItemIndex } from './indexedItems';
import { TabsContext } from './TabsContext';

export type TabProps = {
  /** Overskriften til taben */
  children: React.ReactNode;
  /** Om taben er disabled eller ikke */
  disabled?: boolean;
  /** Indeksen til taben. Settes vanligvis ut fra rekkefølgen i `TabList`, men må
   * angis manuelt dersom taben ligger inne i en egen komponent */
  index?: number;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | React.ElementType;
  removeActiveLine?: boolean;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<'button'>, 'children' | 'disabled'>;

export const Tab = ({
  className,
  removeActiveLine = false,
  as,
  disabled = false,
  index,
  children,
  ...rest
}: TabProps) => {
  const { selectedIndex, onSelect, tabsId } = useContext(TabsContext);
  const { index: tabIndex } = useItemIndex('tab', index);
  const isSelected = selectedIndex === tabIndex;
  const Element: React.ElementType = as || 'button';

  return (
    <Element
      role="tab"
      type={as ? undefined : 'button'}
      id={`${tabsId}-tab-${tabIndex}`}
      aria-selected={isSelected}
      aria-controls={isSelected ? `${tabsId}-panel-${tabIndex}` : undefined}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      className={classNames(
        'eds-tab',
        { 'eds-tab--remove-active-line': removeActiveLine },
        className,
      )}
      {...rest}
      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
        rest.onClick?.(e);
        if (!disabled) onSelect(tabIndex);
      }}
    >
      {children}
    </Element>
  );
};
