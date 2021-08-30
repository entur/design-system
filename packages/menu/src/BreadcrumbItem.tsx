import React from 'react';
import classNames from 'classnames';
import { RightArrowIcon } from '@entur/icons';
import './BreadcrumbNavigation.scss';
import { PolymorphicPropsWithoutRef } from '@entur/utils';

export type BreadcrumbItemOwnProps = {
  /** Komponenten som rendres
   * @default "a"
   */
  as?: 'a' | React.ElementType;
  /** Teksten som vises */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** True om sist i listen. Settes automatisk av BreadcrumbNavigation-komponenten */
  isCurrent?: boolean;
};

export type BreadcrumbItemProps<
  E extends React.ElementType = typeof defaultElement,
> = PolymorphicPropsWithoutRef<BreadcrumbItemOwnProps, E>;

const defaultElement = 'a';

export const BreadcrumbItem = <
  E extends React.ElementType = typeof defaultElement,
>({
  className,
  isCurrent,
  as,
  ...rest
}: BreadcrumbItemProps<E>): JSX.Element => {
  const Element: React.ElementType = as || defaultElement;
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
          className="eds-breadcrumb__separator"
          inline
          role="presentation"
        />
      )}
    </>
  );
};
