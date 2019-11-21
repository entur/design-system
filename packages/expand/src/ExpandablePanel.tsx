import React from 'react';
import { BaseExpandablePanel } from './BaseExpandablePanel';
import { useRandomId } from './useRandomId';

export type ExpandablePanelProps = {
  /** Teksten som skal stå i panelet */
  title: React.ReactNode;
  /** Innholdet som skal vises under panelet */
  children: React.ReactNode;
  /** Hvilken tilstand ExpandablePanel skal ha som default */
  defaultOpen?: boolean;
  /** Funksjonen som styrer åpningen av ExpandablePanel */
  onToggle?: () => void;
  [key: string]: any;
};
export const ExpandablePanel: React.FC<ExpandablePanelProps> = ({
  defaultOpen = false,
  ...rest
}) => {
  const randomId = useRandomId('eds-expandable');

  const [isOpen, setOpen] = React.useState(defaultOpen);

  return (
    <BaseExpandablePanel
      id={randomId}
      open={isOpen}
      onToggle={() => setOpen(prev => !prev)}
      {...rest}
    />
  );
};
