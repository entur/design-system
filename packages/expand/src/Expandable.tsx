import React from 'react';
import { BaseExpand } from './BaseExpand';
import { DownArrowIcon } from '@entur/icons';
import { Heading4 } from '@entur/typography';
import cx from 'classnames';
import './styles.scss';

type ExpandableProps = {
  /** Teksten som skal stå i panelet */
  title: React.ReactNode;
  /** Innholdet som skal vises under panelet */
  children: React.ReactNode;
  /** Prop for om innholdet er åpent. Brukes hvis du vil kontrollere Expandable, sammen med onToggle */
  open?: boolean;
  /** Funksjonen som styrer åpningen av Expandable */
  onToggle?: () => void;
  /** Om ukontrollert styring av expandable, så er denne default=false */
  defaultOpen?: boolean;
  [key: string]: any;
};
export const Expandable: React.FC<ExpandableProps> = ({
  title,
  children,
  open,
  onToggle,
  defaultOpen = false,
  ...rest
}) => {
  const iconClass = cx('entur-expandable-panel__chevron', {
    'entur-expandable--panel__chevron--open': open,
  });

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const updater = isControlled
    ? onToggle
    : () => setInternalOpen(!internalOpen);

  return (
    <div className="entur-expandable" {...rest}>
      <button
        type="button"
        className="entur-expandable--panel"
        onClick={updater}
        aria-expanded={open}
      >
        <Heading4 as="span" className="entur-expandable-panel__title">
          {title}
        </Heading4>
        <DownArrowIcon inline className={iconClass} />
      </button>

      <BaseExpand className="entur-expand--expandable--content" open={isOpen!}>
        {children}
      </BaseExpand>
    </div>
  );
};
