import * as React from 'react';
import { Contrast } from '@entur/layout';
import FrontPageFooter from '../components/Footer/FrontPageFooter';
import TopNavigationLayout from './TopNavigationLayout';
interface FrontPageLayoutProps {
  children: React.ReactNode;
}

const FrontPageLayout: React.FC<FrontPageLayoutProps> = ({
  children,
}: FrontPageLayoutProps) => {
  return (
    <>
      <Contrast>
        <TopNavigationLayout />
      </Contrast>
      <div className="frontpage__site-content-wrapper">
        <main>{children}</main>
        <FrontPageFooter />
      </div>
    </>
  );
};

export default FrontPageLayout;
