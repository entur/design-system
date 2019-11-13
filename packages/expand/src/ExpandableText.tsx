import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon } from '@entur/icons';
import { Heading4 } from '@entur/typography';
import { useRandomId } from './useRandomId';
import { useControllableProp } from './useControllableProp';
import { BaseExpand } from './BaseExpand';
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
  const randomId = useRandomId('eds-expandable-text');
  const [isOpen, updater] = useControllableProp({
    defaultValue: defaultOpen,
    prop: open,
    updater: onToggle,
  });

  return (
    <>
      <button
        className="eds-expandable-text__trigger"
        aria-expanded={isOpen}
        aria-controls={randomId}
        onClick={() => updater(!isOpen)}
        type="button"
        {...rest}
      >
        <DownArrowIcon
          inline
          className={classNames('eds-expandable-text__arrow', {
            'eds-expandable-text__arrow--open': isOpen,
          })}
        />
        <Heading4 as="span">{title}</Heading4>
      </button>
      <BaseExpand
        className="eds-expandable-text__content"
        id={randomId}
        open={isOpen}
      >
        {children}
      </BaseExpand>
    </>
  );
};
