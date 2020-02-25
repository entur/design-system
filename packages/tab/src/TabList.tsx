import React from 'react';
import { TabList as ReachTabList } from '@reach/tabs';
import classNames from 'classnames';

type TabListProps = {
  /** Tab-komponenter */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  width?: 'fluid';
  [key: string]: any;
};

export const TabList: React.FC<TabListProps> = ({
  className,
  width,
  ...rest
}) => {
  return (
    <ReachTabList
      className={classNames('eds-tab-list', className, {
        'eds-tab-list--width-fluid': width === 'fluid',
      })}
      {...rest}
    />
  );
};
