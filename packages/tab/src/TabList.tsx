import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import classNames from 'classnames';

export type TabListProps = {
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
  as: _as,
  children,
  ...rest
}) => {
  return (
    <RadixTabs.List
      className={classNames('eds-tab-list', className, {
        'eds-tab-list--width-fluid': width === 'fluid',
      })}
      {...rest}
    >
      {React.Children.map(children, (child, idx) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              _tabValue: String(idx),
            })
          : child,
      )}
    </RadixTabs.List>
  );
};
