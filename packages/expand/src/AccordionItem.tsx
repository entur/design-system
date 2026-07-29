import React, { CSSProperties, useId } from 'react';
import { BaseExpandablePanel } from './BaseExpandablePanel';
import { useAccordion } from './Accordion';

export type AccordionItemProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'title' | 'onClick'
> & {
  /** Teksten som skal stå i panelet */
  title: React.ReactNode;
  /** Innholdet som skal vises under panelet */
  children: React.ReactNode;
  /** Hvilken tilstand AccordionItem skal ha som default
   * @default false
   */
  defaultOpen?: boolean;
  /** Styling som sendes til innholdet av AccordionItem */
  contentStyle?: CSSProperties;
  /** Deaktiver åpne/lukke-animasjonen */
  disableAnimation?: boolean;
  /** Avmonter innholdet når det lukkes. Når false (standard), holdes innholdet montert og skjules med CSS.
   * @default false
   */
  unmountOnClose?: boolean;
};
export const AccordionItem = React.forwardRef<
  HTMLDivElement,
  AccordionItemProps
>(
  (
    {
      defaultOpen = false,
      id: overrideId,
      contentStyle,
      disableAnimation,
      unmountOnClose,
      ...rest
    },
    ref,
  ) => {
    const randomId = `eds-accordion-item${useId()}`;
    const id = overrideId || randomId;
    const { isOpen, toggle } = useAccordion({ id, defaultOpen });

    return (
      <BaseExpandablePanel
        ref={ref}
        {...rest}
        contentStyle={contentStyle}
        disableAnimation={disableAnimation}
        id={id}
        onToggle={toggle}
        open={isOpen}
        unmountOnClose={unmountOnClose}
      />
    );
  },
);
