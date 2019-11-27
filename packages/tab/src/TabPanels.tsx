import React from 'react';
import { TabPanels as ReachTabPanels } from '@reach/tabs';
import classNames from 'classnames';

type TabPanelsProps = {
  /** Tab-panelene */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  [key: string]: any;
};

export const TabPanels: React.FC<TabPanelsProps> = ({ className, ...rest }) => {
  return (
    <ReachTabPanels
      className={classNames('eds-tab-panels', className)}
      {...rest}
    />
  );
};
