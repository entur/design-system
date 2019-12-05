import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon } from '@entur/icons';
import { Heading4 } from '@entur/typography';
import { useRandomId } from './useRandomId';
import { BaseExpand } from './BaseExpand';
import './ExpandableText.scss';

export type ExpandableTextProps = {
  /** Teksten som skal "vises" */
  title: string;
  /** Innholdet som skal vises under linken */
  children: React.ReactNode;
  /** Hvilken tilstand ExpandableText skal ha som default (med mindre den er kontrollert)
   * @default false
   */
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
  defaultOpen = false,
  ...rest
}) => {
  const randomId = useRandomId('eds-expandable-text');
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <>
      <button
        className="eds-expandable-text__trigger"
        aria-expanded={open}
        aria-controls={randomId}
        onClick={() => setOpen(prev => !prev)}
        type="button"
        {...rest}
      >
        <Heading4 as="span">{title}</Heading4>
        <DownArrowIcon
          inline
          className={classNames('eds-expandable-text__arrow', {
            'eds-expandable-text__arrow--open': open,
          })}
        />
      </button>
      <BaseExpand
        className="eds-expandable-text__content"
        id={randomId}
        open={open}
      >
        {children}
      </BaseExpand>
    </>
  );
};
