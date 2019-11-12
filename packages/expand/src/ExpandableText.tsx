import React from 'react';
import { BaseExpand } from './BaseExpand';
import { DownArrowIcon } from '@entur/icons';
import { Heading4 } from '@entur/typography';
import cx from 'classnames';
import './ExpandableText.scss';

type ExpandableTextProps = {
  /** Teksten som skal "vises" */
  title: string;
  /** Innholdet som skal vises under linken */
  children: React.ReactNode;
  /** Hvilken tilstand ExpandableText skal ha som default (med mindre den er kontrollert) */
  defaultOpen?: boolean;
  /** Prop for om innholdet er åpent. Brukes hvis du vil kontrollere ExpandableText, sammen med onToggle */
  open?: boolean;
  /** Funksjonen som styrer åpningen av ExpandableText */
  onToggle?: () => void;
  [key: string]: any;
};
export const ExpandableText: React.FC<ExpandableTextProps> = ({
  title,
  children,
  open,
  onToggle,
  defaultOpen = false,
  ...rest
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const updater = isControlled
    ? onToggle
    : () => setInternalOpen(!internalOpen);

  const iconClass = cx('entur-expandable-text__chevron', {
    'entur-expandable-text__chevron--open': isOpen,
  });

  const randIdRef = React.useRef(
    'entur-expandable-text-' + String(Math.random()).substring(2),
  );

  return (
    <>
      <button
        className="entur-expandable-text"
        aria-expanded={isOpen}
        aria-controls={randIdRef.current}
        onClick={updater}
        {...rest}
      >
        <DownArrowIcon inline className={iconClass} />
        <Heading4 as="span">{title}</Heading4>
      </button>
      <BaseExpand
        className="entur-expandable-text-content"
        id={randIdRef.current}
        open={isOpen!}
      >
        {children}
      </BaseExpand>
    </>
  );
};
