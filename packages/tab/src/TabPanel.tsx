import React from 'react';
import { TabPanel as ReachTabPanel } from '@reach/tabs';
import classNames from 'classnames';

type TabPanelProps = {
  /** Overskriften til taben */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  [key: string]: any;
};

export const TabPanel: React.FC<TabPanelProps> = ({ className, ...rest }) => {
  return (
    <ReachTabPanel
      className={classNames('eds-tab-panel', className)}
      {...rest}
    />
  );
};
