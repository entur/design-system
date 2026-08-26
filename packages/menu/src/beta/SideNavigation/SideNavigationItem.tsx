import React from 'react';
import classNames from 'classnames';
import type { PolymorphicComponentProps } from '@entur/utils';

import {
  SideNavigationItemContent,
  type SideNavigationItemContentProps,
} from './SideNavigationItemContent';

const defaultElement = 'a';

export type SideNavigationItemOwnProps = Omit<
  SideNavigationItemContentProps,
  'alertFaded'
> & {
  /** Marker elementet som gjeldende side */
  active?: boolean;
  /** Deaktiver elementet. Rendres da som en deaktivert knapp */
  disabled?: boolean;
  /** Ekstra klassenavn */
  className?: string;
};

export type SideNavigationItemProps<
  T extends React.ElementType = typeof defaultElement,
> = PolymorphicComponentProps<T, SideNavigationItemOwnProps>;

export const SideNavigationItem: (<
  E extends React.ElementType = typeof defaultElement,
>(
  props: SideNavigationItemProps<E> & { ref?: React.Ref<Element> },
) => React.ReactElement | null) & { displayName?: string } = React.forwardRef(
  <E extends React.ElementType = typeof defaultElement>(
    {
      as,
      active = false,
      disabled = false,
      className,
      icon,
      badge,
      alert,
      alertLabel,
      children,
      href,
      target,
      rel,
      download,
      ...rest
    }: SideNavigationItemProps<E>,
    ref?: React.Ref<Element>,
  ) => {
    const Element: React.ElementType = disabled
      ? 'button'
      : as || defaultElement;
    const isButton = Element === 'button';

    return (
      <li className={classNames('eds-side-navigation-beta__item', className)}>
        <Element
          className={classNames('eds-side-navigation-beta__click-target', {
            'eds-side-navigation-beta__click-target--active': active,
          })}
          aria-current={active ? 'page' : undefined}
          ref={ref}
          // href and friends are invalid on a <button>, and a <button> without
          // an explicit type submits the form it sits in
          {...(isButton
            ? {
                type: 'button',
                disabled,
                'aria-disabled': disabled || undefined,
              }
            : { href, target, rel, download })}
          {...rest}
        >
          <SideNavigationItemContent
            icon={icon}
            badge={badge}
            alert={alert}
            alertLabel={alertLabel}
          >
            {children}
          </SideNavigationItemContent>
        </Element>
      </li>
    );
  },
);

SideNavigationItem.displayName = 'SideNavigationBeta.Item';
