import React from 'react';
import classNames from 'classnames';
import { BaseExpand } from '@entur/expand';
import { DownArrowIcon } from '@entur/icons';

import {
  SideNavigationItemContent,
  type SideNavigationItemContentProps,
} from './SideNavigationItemContent';

/** Ser etter et `active`-menyelement i undermenyen. Kjøres under render, slik at
 * riktig gruppe er åpen allerede i server-HTML-en. */
const hasActiveDescendant = (node: React.ReactNode): boolean =>
  React.Children.toArray(node).some(child => {
    if (!React.isValidElement(child)) return false;
    const { active, children } = child.props as {
      active?: boolean;
      children?: React.ReactNode;
    };
    return active === true || hasActiveDescendant(children);
  });

export type SideNavigationExpandableItemProps = Omit<
  React.ComponentPropsWithoutRef<'li'>,
  'title' | 'onToggle'
> &
  Omit<SideNavigationItemContentProps, 'children'> & {
    /** Etiketten til det ekspanderbare elementet */
    title: React.ReactNode;
    /** Undermenyen */
    children: React.ReactNode;
    /** Marker elementet som gjeldende side */
    active?: boolean;
    /** Deaktiver elementet */
    disabled?: boolean;
    /** Om undermenyen er åpen. Gjør komponenten kontrollert */
    open?: boolean;
    /** Om undermenyen er åpen ved første render. Kun relevant når komponenten
     * ikke er kontrollert
     * @default false
     */
    defaultOpen?: boolean;
    /** Kalles med den nye tilstanden når undermenyen åpnes eller lukkes */
    onOpenChange?: (open: boolean) => void;
    /** Ekstra klassenavn */
    className?: string;
  };

export const SideNavigationExpandableItem = React.forwardRef<
  HTMLButtonElement,
  SideNavigationExpandableItemProps
>(
  (
    {
      title,
      children,
      active = false,
      disabled = false,
      open,
      defaultOpen = false,
      onOpenChange,
      className,
      icon,
      badge,
      alert,
      alertLabel,
      ...rest
    },
    ref,
  ) => {
    const panelId = React.useId();

    // Åpen-tilstand løses under render: kontrollert > brukerens valg > utledet
    // fra et aktivt underelement. Uten den utledede tilstanden ville menyen
    // kollapse ved hver sidenavigering i en server-rendret app.
    const derivedOpen = hasActiveDescendant(children) || defaultOpen;
    const [state, setState] = React.useState<{
      user: boolean | null;
      derived: boolean;
    }>({ user: null, derived: derivedOpen });

    // Når den utledede tilstanden endrer seg har vi navigert til en annen side,
    // og brukerens tidligere valg gjelder ikke lenger. Justeres under render
    // framfor i en effekt, ellers vises feil gruppe åpen i én frame.
    if (state.derived !== derivedOpen) {
      setState({ user: null, derived: derivedOpen });
    }

    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : state.user ?? derivedOpen;

    const toggle = () => {
      const next = !isOpen;
      if (!isControlled) {
        setState(current => ({ ...current, user: next }));
      }
      onOpenChange?.(next);
    };

    return (
      <li
        className={classNames(
          'eds-side-navigation-beta__item',
          'eds-side-navigation-beta__expandable',
          className,
        )}
        {...rest}
      >
        <button
          type="button"
          className={classNames(
            'eds-side-navigation-beta__click-target',
            'eds-side-navigation-beta__click-target--expandable',
            {
              'eds-side-navigation-beta__click-target--active': active,
            },
          )}
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-current={active ? 'page' : undefined}
          disabled={disabled}
          aria-disabled={disabled || undefined}
          onClick={toggle}
          ref={ref}
        >
          <SideNavigationItemContent
            icon={icon}
            badge={badge}
            alert={alert}
            alertLabel={alertLabel}
          >
            {title}
          </SideNavigationItemContent>
          <DownArrowIcon
            className={classNames('eds-side-navigation-beta__chevron', {
              'eds-side-navigation-beta__chevron--open': isOpen,
            })}
            aria-hidden="true"
          />
        </button>
        <BaseExpand id={panelId} open={isOpen}>
          <ul className="eds-side-navigation-beta__submenu">{children}</ul>
        </BaseExpand>
      </li>
    );
  },
);

SideNavigationExpandableItem.displayName = 'SideNavigationBeta.ExpandableItem';
