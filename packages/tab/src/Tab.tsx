import React from 'react';
import { Tab as ReachTab } from '@reach/tabs';
import classNames from 'classnames';

type TabProps = {
  /** Overskriften til taben */
  children: React.ReactNode;
  /** Om taben er disabled eller ikke */
  disabled?: boolean;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  [key: string]: any;
};

export const Tab: React.FC<TabProps> = ({ className, ...rest }) => {
  return <ReachTab className={classNames('eds-tab', className)} {...rest} />;
};
