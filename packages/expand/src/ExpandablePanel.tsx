import React, { CSSProperties } from 'react';
import { useRandomId } from '@entur/utils';
import { BaseExpandablePanel } from './BaseExpandablePanel';

export type ExpandablePanelProps = {
  /** Teksten som skal stå i panelet */
  title: React.ReactNode;
  /** Innholdet som skal vises under panelet */
  children: React.ReactNode;
  /** Hvilken tilstand ExpandablePanel skal ha som default
   * @default false
   */
  defaultOpen?: boolean;
  /** Prop for om innholdet er åpent. Brukes hvis du vil kontrollere ExpandablePanel, sammen med onToggle */
  open?: boolean;
  /** Funksjonen som styrer åpningen av ExpandablePanel */
  onToggle?: () => void;
  /** Styling som sendes til innholdet av ExpandablePanel */
  contentStyle?: CSSProperties;
  /** Avmonter innholdet når det lukkes. Når false (standard), holdes innholdet montert og skjules med CSS.
   * @default false
   */
  unmountOnClose?: boolean;
  [key: string]: any;
};
export const ExpandablePanel: React.FC<ExpandablePanelProps> = ({
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  contentStyle,
  unmountOnClose,
  ...rest
}) => {
  const randomId = useRandomId('eds-expandable');

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleToggle = () => {
    if (!isControlled) {
      setInternalOpen(prev => !prev);
    }
    onToggle?.();
  };

  return (
    <BaseExpandablePanel
      id={randomId}
      open={isOpen}
      onToggle={handleToggle}
      contentStyle={contentStyle}
      unmountOnClose={unmountOnClose}
      {...rest}
    />
  );
};
