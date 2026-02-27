import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import classNames from 'classnames';

export type TabProps = {
  /** Overskriften til taben */
  children: React.ReactNode;
  /** Om taben er disabled eller ikke */
  disabled?: boolean;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  removeActiveLine?: boolean;
  /** @internal Injected by TabList */
  _tabValue?: string;
  [key: string]: any;
};

export const Tab: React.FC<TabProps> = ({
  className,
  removeActiveLine = false,
  as: _as,
  _tabValue = '0',
  ...rest
}) => {
  return (
    <RadixTabs.Trigger
      className={classNames(
        'eds-tab',
        { 'eds-tab--remove-active-line': removeActiveLine },
        className,
      )}
      value={_tabValue}
      {...rest}
    />
  );
};
