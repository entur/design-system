import React from 'react';
import classNames from 'classnames';

export type SideNavigationGroupProps = Omit<
  React.ComponentPropsWithoutRef<'li'>,
  'title'
> & {
  /** Overskriften til gruppen */
  title: React.ReactNode;
  /** Menyelementene i gruppen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
};

export const SideNavigationGroup = React.forwardRef<
  HTMLLIElement,
  SideNavigationGroupProps
>(({ title, children, className, ...rest }, ref) => {
  const titleId = React.useId();

  return (
    <li
      className={classNames('eds-side-navigation-beta__group', className)}
      ref={ref}
      {...rest}
    >
      <span className="eds-side-navigation-beta__group-title" id={titleId}>
        {title}
      </span>
      <ul
        className="eds-side-navigation-beta__group-list"
        aria-labelledby={titleId}
      >
        {children}
      </ul>
    </li>
  );
});

SideNavigationGroup.displayName = 'SideNavigationBeta.Group';
