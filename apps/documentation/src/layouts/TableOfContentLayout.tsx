import React from 'react';
import { useWindowDimensions } from '@entur/utils';
import { pxToRem } from 'src/utils/utils';
import MdxTableOfContent from '@components/Navigations/TableOfContent/MdxTableOfContent';

const TableOfContentLayout = () => {
  const { width } = useWindowDimensions();
  const remWidth = pxToRem(width);
  const isLargeScreen = remWidth !== undefined && remWidth >= 60;

  if (isLargeScreen) {
    return (
      <div>
        <MdxTableOfContent />
      </div>
    );
  }

  return <></>;
};

export default TableOfContentLayout;
