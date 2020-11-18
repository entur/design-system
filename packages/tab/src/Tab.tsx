import React from 'react';
import { Tab as ReachTab } from '@reach/tabs';
import classNames from 'classnames';

export type TabProps = {
  /** Overskriften til taben */
  children: React.ReactNode;
  /** Om taben er disabled eller ikke */
  disabled?: boolean;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  removeActiveLine?: boolean;
  [key: string]: any;
};

export const Tab: React.FC<TabProps> = ({
  className,
  removeActiveLine = false,
  ...rest
}) => {
  return (
    <ReachTab
      className={classNames(
        'eds-tab',
        { 'eds-tab--remove-active-line': removeActiveLine },
        className,
      )}
      {...rest}
    />
  );
};
