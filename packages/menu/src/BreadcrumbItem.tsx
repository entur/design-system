import React from 'react';
import classNames from 'classnames';
import { RightArrowIcon } from '@entur/icons';
import { PolymorphicComponentProps } from '@entur/utils';

export type BreadcrumbItemOwnProps = {
  /** Komponenten som rendres
   * @default "a"
   */
  as?: 'a' | React.ElementType;
  /** Teksten som vises */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** @internal
   * Markerer aktivt element, i.e. siste element.
   * Settes automatisk av BreadcrumbNavigation og kan ikke overskrives */
  isCurrent?: boolean;
};

export type BreadcrumbItemProps<
  T extends React.ElementType = typeof defaultElement,
> = PolymorphicComponentProps<T, BreadcrumbItemOwnProps>;

const defaultElement = 'a';

export const BreadcrumbItem = <
  E extends React.ElementType = typeof defaultElement,
>({
  className,
  isCurrent,
  as,
  ...rest
}: BreadcrumbItemProps<E>): JSX.Element => {
  const Element: React.ElementType =
    as || (isCurrent ? 'span' : defaultElement);
  return (
    <li className={classNames('eds-breadcrumbs__item', className)}>
      <Element
        aria-current={isCurrent ? 'page' : undefined}
        className={classNames('eds-breadcrumbs__item__link', {
          'eds-breadcrumbs__item__link--current': isCurrent,
        })}
        {...rest}
      />
      {!isCurrent && (
        <RightArrowIcon
          className="eds-breadcrumbs__separator"
          inline
          role="presentation"
        />
      )}
    </li>
  );
};
