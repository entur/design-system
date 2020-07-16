import React from 'react';
import classNames from 'classnames';
import { BaseExpand, ExpandArrow } from '@entur/expand';
import { useSideNavigationContext } from './CollapsibleSideNavigation';
import { useShowDelayedLabel } from './useShowDelayedLabel';
import { useControllableProp } from './useControllableProp';

export type SideNavigationGroupProps = {
  /** Skal menygruppen være ekspandert by default? Kun relevant om komponenten ikke er kontrollert
   * @default false
   */
  defaultOpen?: boolean;
  /** Er menyen åpen? */
  open?: boolean;
  /** Kalles når menygruppen åpnes eller lukkes */
  onToggle?: () => void;
  /** Ekstra klassenavn */
  className?: string;
  /** Menyen som skal grupperes */
  children: React.ReactNode;
  /** Overskriften til menyen */
  title: React.ReactNode;
  icon?: React.ReactNode;
  [key: string]: any;
};

export const SideNavigationGroup: React.FC<SideNavigationGroupProps> = ({
  defaultOpen = false,
  open,
  onToggle,
  className,
  children,
  title,
  icon,
  ...rest
}) => {
  const [isOpen, setOpen] = useControllableProp({
    prop: open,
    updater: onToggle,
    defaultValue: defaultOpen,
  });
  const { isCollapsed, setIsCollapsed } = useSideNavigationContext();

  const [showLabel] = useShowDelayedLabel(isCollapsed);
  React.useEffect(() => {
    if (isOpen) {
      setIsCollapsed(false);
    }
  }, [isOpen, setIsCollapsed]);

  React.useEffect(() => {
    if (isCollapsed) {
      setOpen(false);
    }
  }, [isCollapsed, setOpen]);

  return (
    <div
      className={classNames('eds-side-navigation-group', className)}
      {...rest}
    >
      <button
        onClick={() => setOpen(!isOpen)}
        type="button"
        className="eds-side-navigation-group__trigger"
      >
        <span>
          {icon}
          {showLabel && title}
        </span>
        {showLabel && (
          <ExpandArrow
            open={isOpen}
            className="eds-side-navigation-group__icon"
          />
        )}
      </button>
      <BaseExpand open={isOpen}>{children}</BaseExpand>
    </div>
  );
};
