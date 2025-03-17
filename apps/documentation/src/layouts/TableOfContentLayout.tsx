import React from 'react';
import { useWindowDimensions } from '@entur/utils';
import { pxToRem } from 'src/utils/utils';
import TableOfContent from '@components/Navigations/TableOfContent/TableOfContent';

const TableOfContentLayout = () => {
  const { width } = useWindowDimensions();
  const remWidth = pxToRem(width);
  const isLargeScreen = remWidth !== undefined && remWidth >= 60;

  if (isLargeScreen) {
    return (
      <div>
        <TableOfContent />
      </div>
    );
  }

  return <></>;
};

export default TableOfContentLayout;
