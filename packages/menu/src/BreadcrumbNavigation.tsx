import React from 'react';
import './BreadcrumbNavigation.scss';

export type BreadcrumbNavigationProps = {
  /** Label for brødsmulestien.
   * @default 'Brødsmulesti'
   */
  'aria-label'?: string;
  /** En liste med BreadcrumbItem-er */
  children: React.ReactElement[];
};

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  'aria-label': ariaLabel = 'Brødsmulesti',
  children,
}) => {
  return (
    <nav aria-label={ariaLabel}>
      <ol className="eds-breadcrumbs">
        {React.Children.map(children, (child, index) => {
          // @ts-expect-error should check if children are correct but for now it is only mentioned in the documentation
          return React.cloneElement(child, {
            isCurrent: index + 1 === React.Children.count(children),
          });
        })}
      </ol>
    </nav>
  );
};
