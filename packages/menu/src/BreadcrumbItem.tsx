import React from 'react';
import classNames from 'classnames';
import { RightArrowIcon } from '@entur/icons';

export type BreadcrumbItemProps = {
  /** Komponenten som rendres */
  as?: 'a' | React.ElementType;
  /** Teksten som vises */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** True om sist i listen. Settes automatisk av BreadcrumbNavigation-komponenten */
  isCurrent?: boolean;
  [key: string]: any;
};

export const BreadcrumbItem: React.FC<BreadcrumbItemProps> = ({
  as: Element = 'a',
  className,
  isCurrent,
  ...rest
}) => {
  return (
    <>
      <li className={classNames('eds-breadcrumb__item', className)}>
        <Element
          aria-current={isCurrent ? 'page' : undefined}
          className={classNames('eds-breadcrumb__link', {
            'eds-breadcrumb__link--current': isCurrent,
          })}
          {...rest}
        />
      </li>
      {!isCurrent && (
        <RightArrowIcon
          className="eds-breadcrumbs__separator"
          inline
          role="presentation"
        />
      )}
    </>
  );
};
