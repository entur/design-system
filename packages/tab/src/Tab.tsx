import React, { useContext } from 'react';
import classNames from 'classnames';

import { TabItemContext, TabsContext } from './TabsContext';

export type TabProps = {
  /** Overskriften til taben */
  children: React.ReactNode;
  /** Om taben er disabled eller ikke */
  disabled?: boolean;
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
  children,
  ...rest
}: TabProps) => {
  const { selectedIndex, onSelect } = useContext(TabsContext);
  const itemContext = useContext(TabItemContext);
  const tabIndex = itemContext?.tabIndex ?? 0;
  const isSelected = selectedIndex === tabIndex;
  const Element: React.ElementType = as || 'button';

  return (
    <Element
      role="tab"
      type={as ? undefined : 'button'}
      id={itemContext?.tabId}
      aria-selected={isSelected}
      aria-controls={itemContext?.panelId}
      tabIndex={isSelected ? 0 : -1}
      disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      className={classNames(
        'eds-tab',
        { 'eds-tab--remove-active-line': removeActiveLine },
        className,
      )}
      onClick={() => {
        if (!disabled) onSelect(tabIndex);
      }}
      {...rest}
    >
      {children}
    </Element>
  );
};
