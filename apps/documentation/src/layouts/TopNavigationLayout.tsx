import * as React from 'react';
import TopNavigation from '@components/Navigations/TopNavigation/TopNavigation';
import MobileTopNavigation from '@components/Navigations/TopNavigation/MobileTopNavigation';
import { useWindowDimensions } from '@entur/utils';
import { pxToRem } from 'src/utils/utils';

const TopNavigationLayout: React.FC<
  React.HTMLAttributes<HTMLElement>
> = props => {
  const { width } = useWindowDimensions();
  const remWidth = pxToRem(width);
  const isMobile = remWidth !== undefined && remWidth < 60;
  return isMobile ? (
    <MobileTopNavigation {...props} />
  ) : (
    <TopNavigation {...props} />
  );
};

export default TopNavigationLayout;
