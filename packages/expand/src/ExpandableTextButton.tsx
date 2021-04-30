import React from 'react';
import { Heading5 } from '@entur/typography';
import { ExpandArrow } from './ExpandArrow';

export type ExandableTextButtonProps = {
  children: React.ReactNode;
  /** Prop for om innholdet er åpent */
  open?: boolean;
  /** Funksjonen som styrer åpningen av ExpandableTextButton */
  onToggle: () => void;
  /** Den typografiske komponenten for tittelen
   * @default Heading5
   */
  as?: React.ElementType;
  [key: string]: any;
};

export const ExpandableTextButton: React.FC<ExandableTextButtonProps> = ({
  children,
  open,
  onToggle,
  as: Component = Heading5,
  ...rest
}) => {
  return (
    <button
      className="eds-expandable-text__trigger"
      aria-expanded={open}
      type="button"
      onClick={onToggle}
      {...rest}
    >
      <Component as="span">{children}</Component>
      <ExpandArrow open={open} className="eds-expandable-text__arrow" inline />
    </button>
  );
};
