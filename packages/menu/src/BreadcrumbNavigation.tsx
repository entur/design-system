import React from 'react';
import classNames from 'classnames';

import './BreadcrumbNavigation.scss';

export type BreadcrumbNavigationProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'aria-label' | 'children'
> & {
  /** Label for brødsmulestien.
   * @default 'Brødsmulesti'
   */
  'aria-label'?: string;
  /** En liste med BreadcrumbItem-er */
  children: React.ReactNode;
};

export const BreadcrumbNavigation = ({
  'aria-label': ariaLabel = 'Brødsmulesti',
  className,
  children,
  ...rest
}: BreadcrumbNavigationProps) => {
  const childrenArray = React.Children.toArray(children);

  const _children = childrenArray.map((child, index) => {
    if (!React.isValidElement(child)) {
      if (process.env.NODE_ENV !== 'production')
        console.warn('Received a non-element child, it will be ignored.');

      return null;
    }

    const element = child as React.ReactElement<any>;
    return React.cloneElement(element, {
      isCurrent: index + 1 === childrenArray.length,
    });
  });

  return (
    <nav
      className={classNames('eds-breadcrumbs', className)}
      aria-label={ariaLabel}
      {...rest}
    >
      <ol className="eds-breadcrumbs__list">{_children}</ol>
    </nav>
  );
};
