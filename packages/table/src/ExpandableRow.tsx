import React from 'react';
import { BaseExpand } from '@entur/expand';

export type ExpandableRowProps = {
  /** Antall kolonner tabellraden er */
  colSpan: number;
  /** Innholdet til ExpandableRow */
  children: React.ReactNode;
  /** Om ExpandableRow er åpen
   * @default false
   */
  open?: boolean;
};

export const ExpandableRow: React.FC<ExpandableRowProps> = ({
  open = false,
  children,
  colSpan,
}) => {
  return (
    <tr>
      <td colSpan={colSpan}>
        <BaseExpand open={open}>{children}</BaseExpand>
      </td>
    </tr>
  );
};
