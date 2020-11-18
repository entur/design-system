import React from 'react';
import { Tabs as ReachTabs } from '@reach/tabs';
import classNames from 'classnames';

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

export const Tabs: React.FC<TabsProps> = ({ className, ...rest }) => {
  return <ReachTabs className={classNames('eds-tabs', className)} {...rest} />;
};
