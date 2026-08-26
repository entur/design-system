import React from 'react';
import classNames from 'classnames';
import { BaseExpand } from '@entur/expand';
import { DownArrowIcon } from '@entur/icons';
import { getNodeText } from '@entur/utils';

import {
  SideNavigationItemContent,
  type SideNavigationItemContentProps,
} from './SideNavigationItemContent';
import { warnOnMixedIcons } from './warnOnMixedIcons';

/** Looks for `active` and `alert` items in the submenu. Runs during render, so
 * the right group is already open in the server HTML. */
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

    warnOnMixedIcons(children, `the submenu "${getNodeText(title)}"`);

    // Open state is resolved during render: controlled > the user's own toggle >
    // derived from an active descendant. Without the derived tier the menu would
    // collapse on every navigation in a server-rendered app.
    const submenu = scanSubmenu(children);
    const derivedOpen = submenu.active || defaultOpen;
    const [state, setState] = React.useState<{
      user: boolean | null;
      derived: boolean;
    }>({ user: null, derived: derivedOpen });

    // Gaining the active page clears the user's toggle; losing it keeps the
    // panel as it stands. Set during render, not in an effect, which would paint
    // the wrong group open for one frame.
    if (state.derived !== derivedOpen) {
      setState({
        user: derivedOpen ? null : state.user ?? true,
        derived: derivedOpen,
      });
    }

    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : state.user ?? derivedOpen;

    // How much of the marking this draws depends on isOpen — see the stylesheet
    const showActive = active || submenu.active;

    // Rendered whether or not it is faded, so isOpen does not shift the label
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
