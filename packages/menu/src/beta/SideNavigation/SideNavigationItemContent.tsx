import React from 'react';
import classNames from 'classnames';

export type SideNavigationItemContentProps = {
  /** Ikon som vises til venstre for etiketten */
  icon?: React.ReactNode;
  /** Innhold som vises til høyre for etiketten, typisk en StatusBadge */
  badge?: React.ReactNode;
  /** Viser en varselprikk ytterst til høyre */
  alert?: boolean;
  /** Behold plassen til varselprikken, men ton den ut. Brukes av
   * ExpandableItem når undermenyen er åpen og menyelementene viser sine egne
   * prikker */
  alertFaded?: boolean;
  /** Tekst som leses opp for varselprikken
   * @default 'Varsel'
   */
  alertLabel?: string;
  children: React.ReactNode;
};

/** Delt radinnhold for menyelementer og ekspanderbare menyelementer. */
export const SideNavigationItemContent: React.FC<
  SideNavigationItemContentProps
> = ({ icon, badge, alert, alertFaded, alertLabel = 'Varsel', children }) => (
  <>
    <span className="eds-side-navigation-beta__label">
      <span className="eds-side-navigation-beta__label-text">
        {icon && <span className="eds-side-navigation-beta__icon">{icon}</span>}
        <span className="eds-side-navigation-beta__text">{children}</span>
      </span>
      {badge && (
        <span className="eds-side-navigation-beta__badge">{badge}</span>
      )}
    </span>
    {alert && (
      // Kept in the row while faded, so the fade has a start and an end
      <span
        className={classNames('eds-side-navigation-beta__alert', {
          'eds-side-navigation-beta__alert--faded': alertFaded,
        })}
        role="img"
        aria-label={alertLabel}
        aria-hidden={alertFaded || undefined}
      />
    )}
  </>
);

SideNavigationItemContent.displayName = 'SideNavigationBeta.ItemContent';
