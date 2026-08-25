import React from 'react';
import classNames from 'classnames';
import { BaseExpand } from '@entur/expand';
import { DownArrowIcon } from '@entur/icons';

import {
  SideNavigationItemContent,
  type SideNavigationItemContentProps,
} from './SideNavigationItemContent';

/** Ser etter `active`- og `alert`-menyelementer i undermenyen. Kjøres under
 * render, slik at riktig gruppe er åpen allerede i server-HTML-en. */
const scanSubmenu = (
  node: React.ReactNode,
): { active: boolean; alert: boolean } => {
  let active = false;
  let alert = false;

  React.Children.forEach(node, child => {
    if (!React.isValidElement(child)) return;
    const props = child.props as {
      active?: boolean;
      alert?: boolean;
      children?: React.ReactNode;
    };
    const nested = scanSubmenu(props.children);
    active = active || props.active === true || nested.active;
    alert = alert || props.alert === true || nested.alert;
  });

  return { active, alert };
};

export type SideNavigationExpandableItemProps = Omit<
  React.ComponentPropsWithoutRef<'li'>,
  'title' | 'onToggle'
> &
  Omit<SideNavigationItemContentProps, 'children' | 'alert' | 'alertFaded'> & {
    /** Etiketten til det ekspanderbare elementet */
    title: React.ReactNode;
    /** Undermenyen */
    children: React.ReactNode;
    /** Marker elementet som gjeldende side */
    active?: boolean;
    /** Vis en varselprikk selv om ingen menyelementer i undermenyen har
     * `alert`. Prikken vises uansett bare når undermenyen er lukket – er den
     * åpen, viser menyelementene sine egne prikker */
    alert?: boolean;
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

    // Open state is resolved during render: controlled > the user's own toggle >
    // derived from an active descendant. Without the derived tier the menu would
    // collapse on every navigation in a server-rendered app.
    const submenu = scanSubmenu(children);
    const derivedOpen = submenu.active || defaultOpen;
    const [state, setState] = React.useState<{
      user: boolean | null;
      derived: boolean;
    }>({ user: null, derived: derivedOpen });

    // A change in the derived value means we navigated to another page, so the
    // user's earlier toggle no longer applies. Adjusted during render rather than
    // in an effect, which would paint the wrong group open for one frame.
    if (state.derived !== derivedOpen) {
      setState({ user: null, derived: derivedOpen });
    }

    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : state.user ?? derivedOpen;

    // Marked as leading to the current page when the item itself is active or
    // the active page sits inside its submenu. The open state decides how much
    // of the marking is drawn — see the stylesheet.
    const showActive = active || submenu.active;

    // The dot stands in for the submenu's own dots while they are hidden, so it
    // fades out as soon as the submenu can show them itself. It stays in the
    // row either way, so opening the submenu does not shift the label.
    const hasAlert = alert || submenu.alert;

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
              'eds-side-navigation-beta__click-target--active': showActive,
              'eds-side-navigation-beta__click-target--open': isOpen,
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
            alert={hasAlert}
            alertFaded={isOpen}
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
