import React from 'react';
import { TabList as ReachTabList } from '@reach/tabs';
import classNames from 'classnames';

type TabListProps = {
  /** Tab-komponenter */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  [key: string]: any;
};

export const TabList: React.FC<TabListProps> = ({ className, ...rest }) => {
  return (
    <ReachTabList className={classNames('eds-tab-list', className)} {...rest} />
  );
};
