import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import classNames from 'classnames';

export type TabPanelProps = {
  /** Overskriften til taben */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  /** @internal Injected by TabPanels */
  _tabValue?: string;
  [key: string]: any;
};

export const TabPanel: React.FC<TabPanelProps> = ({
  className,
  as: _as,
  _tabValue = '0',
  ...rest
}) => {
  return (
    <RadixTabs.Content
      className={classNames('eds-tab-panel', className)}
      value={_tabValue}
      tabIndex={undefined}
      {...rest}
    />
  );
};
