import React from 'react';
import { BaseExpand } from './BaseExpand';
import { DownArrowIcon } from '@entur/icons';
import { Heading4 } from '@entur/typography';
import cx from 'classnames';
import './ExpandableLink.scss';

type ExpandableLinkProps = {
  /** Teksten som skal vises som en link */
  title: string;
  /** Innholdet som skal vises under linken */
  children: React.ReactNode;
  /** HTML-elementet eller React-komponenten som lager knappen */
  as?: 'a' | 'button' | React.ElementType;
  /** Hvilken tilstand ExpandablePanel skal ha som default (med mindre den er kontrollert) */
  defaultOpen?: boolean;
  /** Prop for om innholdet er åpent. Brukes hvis du vil kontrollere ExpandablePanel, sammen med onToggle */
  open?: boolean;
  /** Funksjonen som styrer åpningen av ExpandablePanel */
  onToggle?: () => void;
  [key: string]: any;
};
export const ExpandableLink: React.FC<ExpandableLinkProps> = ({
  title,
  children,
  as,
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

  const iconClass = cx('entur-expandable-link__chevron', {
    'entur-expandable-link__chevron--open': isOpen,
  });

  const randIdRef = React.useRef(
    'entur-expandable-link-' + String(Math.random()).substring(2),
  );

  return (
    <>
      <button
        className="entur-expandable-link"
        aria-expanded={isOpen}
        aria-controls={randIdRef.current}
        onClick={updater}
        {...rest}
      >
        <DownArrowIcon inline className={iconClass} />
        <Heading4 as="span">{title}</Heading4>
      </button>
      <BaseExpand
        className="entur-expandable-link-content"
        id={randIdRef.current}
        open={isOpen!}
      >
        {children}
      </BaseExpand>
    </>
  );
};
