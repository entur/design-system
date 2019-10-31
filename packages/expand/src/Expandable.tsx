import React from 'react';
import { BaseExpand } from './BaseExpand';
import { DownArrowIcon } from '@entur/icons';
import { Heading4 } from '@entur/typography';
import cx from 'classnames';
import './styles.scss';

type ControlledExpandableProps = {
  /** Teksten som skal stå i panelet */
  title: React.ReactNode;
  /** Innholdet som skal vises under panelet */
  children: React.ReactNode;
  /** Prop for om innholdet er åpent */
  open: boolean;
  /** Funksjonen som styrer åpningen av Expandable */
  onToggle: () => void;
  [key: string]: any;
};
export const ControlledExpandable: React.FC<ControlledExpandableProps> = ({
  title,
  children,
  open,
  onToggle,
  ...rest
}) => {
  const iconClass = cx('entur-expand-expandable--panel__chevron', {
    'entur-expand-expandable--panel__chevron--open': open,
  });

  return (
    <div className="entur-expand-expandable" {...rest}>
      <button
        type="button"
        className="entur-expand-expandable--panel"
        onClick={onToggle}
      >
        <span className="entur-expand-expandable--panel__title">
          <Heading4>{title}</Heading4>
        </span>
        <DownArrowIcon inline className={iconClass} />
      </button>

      <BaseExpand className="entur-expand--expandable--content" open={open}>
        {children}
      </BaseExpand>
    </div>
  );
};

type ExpandableProps = {
  /** Teksten som skal stå i panelet */
  title: React.ReactNode;
  /** Om innholdet skal være åpent som default */
  defaultOpen?: boolean;
  /** Innholdet som skal vises ved klikk */
  children: React.ReactNode;
};

export const Expandable: React.FC<ExpandableProps> = ({
  title,
  defaultOpen = false,
  children,
  ...rest
}) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <ControlledExpandable
      title={title}
      open={open}
      onToggle={() => setOpen(!open)}
      {...rest}
    >
      {children}
    </ControlledExpandable>
  );
};
