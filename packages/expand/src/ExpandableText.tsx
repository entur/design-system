import React from 'react';
import { useRandomId } from '@entur/utils';
import { ExpandableTextButton } from './ExpandableTextButton';
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
  const [isOpen, setOpen] = React.useState(defaultOpen);

  return (
    <>
      <ExpandableTextButton
        aria-controls={randomId}
        open={isOpen}
        onToggle={() => setOpen(prev => !prev)}
        {...rest}
      >
        {title}
      </ExpandableTextButton>
      <BaseExpand
        className="eds-expandable-text__content"
        id={randomId}
        open={isOpen}
        {...rest}
      >
        {children}
      </BaseExpand>
    </>
  );
};
