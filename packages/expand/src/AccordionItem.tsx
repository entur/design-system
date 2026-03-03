import React, { CSSProperties } from 'react';
import { useRandomId } from '@entur/utils';
import { BaseExpandablePanel } from './BaseExpandablePanel';
import { useAccordion } from './Accordion';

export type AccordionItemProps = {
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
  disableAnimation?: boolean;
  /** Avmonter innholdet når det lukkes. Når false (standard), holdes innholdet montert og skjules med CSS.
   * @default false
   */
  unmountOnClose?: boolean;
  [key: string]: any;
};
export const AccordionItem: React.FC<AccordionItemProps> = ({
  defaultOpen = false,
  id: overrideId,
  contentStyle,
  unmountOnClose,
  ...rest
}) => {
  const randomId = useRandomId('eds-accordion-item');
  const id = overrideId || randomId;
  const { isOpen, toggle } = useAccordion({ id, defaultOpen });

  return (
    <BaseExpandablePanel
      {...rest}
      contentStyle={contentStyle}
      id={id}
      onToggle={toggle}
      open={isOpen}
      unmountOnClose={unmountOnClose}
    />
  );
};
