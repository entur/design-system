import React from 'react';
import { BaseExpand } from '@entur/expand';

type ExpandableRowProps = {
  open?: boolean;
  children: React.ReactNode;
};

export const ExpandableRow: React.FC<ExpandableRowProps> = ({
  open = false,
  children,
}) => {
  return (
    <tr>
      <td>
        <BaseExpand open={open}>{children}</BaseExpand>
      </td>
    </tr>
  );
};
