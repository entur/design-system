import * as React from 'react';
import TopNavigation from '@components/Navigations/TopNavigation/TopNavigation';
import MobileTopNavigation from '@components/Navigations/TopNavigation/MobileTopNavigation';
import { useWindowDimensions } from '@entur/utils';

const TopNavigationLayout: React.FC = () => {
  const { width } = useWindowDimensions();
  const isMobile = width !== undefined && width <= 960;
  return isMobile ? <MobileTopNavigation /> : <TopNavigation />;
};

export default TopNavigationLayout;
