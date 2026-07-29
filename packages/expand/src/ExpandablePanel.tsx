import React, { CSSProperties, useId } from 'react';
import { BaseExpandablePanel } from './BaseExpandablePanel';

export type ExpandablePanelProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'title' | 'onClick'
> & {
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
  /** Deaktiver åpne/lukke-animasjonen */
  disableAnimation?: boolean;
  /** Avmonter innholdet når det lukkes. Når false (standard), holdes innholdet montert og skjules med CSS.
   * @default false
   */
  unmountOnClose?: boolean;
};
export const ExpandablePanel = React.forwardRef<
  HTMLDivElement,
  ExpandablePanelProps
>(
  (
    {
      defaultOpen = false,
      open: controlledOpen,
      onToggle,
      contentStyle,
      disableAnimation,
      unmountOnClose,
      id: overrideId,
      ...rest
    },
    ref,
  ) => {
    const randomId = `eds-expandable${useId()}`;
    const id = overrideId || randomId;

    const [internalOpen, setInternalOpen] =
      React.useState<boolean>(defaultOpen);
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
        ref={ref}
        id={id}
        open={isOpen}
        onToggle={handleToggle}
        contentStyle={contentStyle}
        disableAnimation={disableAnimation}
        unmountOnClose={unmountOnClose}
        {...rest}
      />
    );
  },
);
