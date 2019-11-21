import React from 'react';
import classNames from 'classnames';
import { BaseExpand } from '@entur/expand';
import { DownArrowIcon } from '@entur/icons';

export type SideNavigationGroupProps = {
  /** Skal menygruppen være ekspandert by default? Kun relevant om komponenten ikke er kontrollert */
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
  [key: string]: any;
};

export type UseControllablePropType<T> = {
  prop?: T;
  updater?: (value?: T) => void;
  defaultValue: T;
};
function useControllableProp<T>({
  prop,
  updater = () => {},
  defaultValue,
}: UseControllablePropType<T>): [T, Function] {
  const [internalState, setInternalState] = React.useState<T>(defaultValue);
  React.useEffect(() => {
    if (prop !== undefined) {
      setInternalState(prop);
    }
  }, [prop]);
  return prop === undefined
    ? [internalState, setInternalState]
    : [prop, updater];
}

export const SideNavigationGroup: React.FC<SideNavigationGroupProps> = ({
  defaultOpen = false,
  open,
  onToggle,
  className,
  children,
  title,
  ...rest
}) => {
  const [isOpen, setOpen] = useControllableProp({
    prop: open,
    updater: onToggle,
    defaultValue: defaultOpen,
  });

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
        <span>{title}</span>
        <DownArrowIcon
          inline
          className={classNames('eds-side-navigation-group__icon', {
            'eds-side-navigation-group__icon--open': isOpen,
          })}
        />
      </button>
      <BaseExpand open={isOpen}>{children}</BaseExpand>
    </div>
  );
};
