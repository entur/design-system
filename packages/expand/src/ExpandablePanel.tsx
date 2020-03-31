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
  /** Funksjonen som styrer åpningen av ExpandablePanel */
  onToggle?: () => void;
  /** Styling som sendes til innholdet av ExpandablePanel */
  contentStyle?: CSSProperties;
  [key: string]: any;
};
export const ExpandablePanel: React.FC<ExpandablePanelProps> = ({
  defaultOpen = false,
  contentStyle,
  ...rest
}) => {
  const randomId = useRandomId('eds-expandable');

  const [isOpen, setOpen] = React.useState(defaultOpen);

  return (
    <BaseExpandablePanel
      id={randomId}
      open={isOpen}
      onToggle={() => setOpen(prev => !prev)}
      contentStyle={contentStyle}
      {...rest}
    />
  );
};
