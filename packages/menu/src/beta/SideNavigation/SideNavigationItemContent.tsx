import React from 'react';

export type SideNavigationItemContentProps = {
  /** Ikon som vises til venstre for etiketten */
  icon?: React.ReactNode;
  /** Innhold som vises til høyre for etiketten, typisk en StatusBadge */
  badge?: React.ReactNode;
  /** Viser en varselprikk ytterst til høyre */
  alert?: boolean;
  /** Tekst som leses opp for varselprikken
   * @default 'Varsel'
   */
  alertLabel?: string;
  children: React.ReactNode;
};

/** Delt radinnhold for menyelementer og ekspanderbare menyelementer. */
export const SideNavigationItemContent: React.FC<
  SideNavigationItemContentProps
> = ({ icon, badge, alert, alertLabel = 'Varsel', children }) => (
  <>
    <span className="eds-side-navigation-beta__label">
      <span className="eds-side-navigation-beta__label-text">
        {icon && <span className="eds-side-navigation-beta__icon">{icon}</span>}
        <span>{children}</span>
      </span>
      {badge && (
        <span className="eds-side-navigation-beta__badge">{badge}</span>
      )}
    </span>
    {alert && (
      <span
        className="eds-side-navigation-beta__alert"
        role="img"
        aria-label={alertLabel}
      />
    )}
  </>
);

SideNavigationItemContent.displayName = 'SideNavigationBeta.ItemContent';
