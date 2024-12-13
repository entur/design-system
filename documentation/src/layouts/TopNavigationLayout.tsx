import * as React from 'react';
import TopNavigation from '@components/Navigations/TopNavigation/TopNavigation';
import { Media } from '@providers/MediaBreakpoint';
import MobileTopNavigation from '@components/Navigations/TopNavigation/MobileTopNavigation';

const TopNavigationLayout: React.FC = () => {
  return (
    <>
      <Media at="mobile">
        <MobileTopNavigation />
      </Media>
      <Media greaterThanOrEqual="desktop">
        <TopNavigation />
      </Media>
    </>
  );
};

export default TopNavigationLayout;
