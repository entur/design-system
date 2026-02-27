import React from 'react';
import classNames from 'classnames';

export type TabPanelsProps = {
  /** Tab-panelene */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager komponenten */
  as?: keyof JSX.IntrinsicElements | any;
  [key: string]: any;
};

export const TabPanels: React.FC<TabPanelsProps> = ({
  className,
  as: _as,
  children,
  ...rest
}) => {
  return (
    <div className={classNames('eds-tab-panels', className)} {...rest}>
      {React.Children.map(children, (child, idx) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement, {
              _tabValue: String(idx),
            })
          : child,
      )}
    </div>
  );
};
