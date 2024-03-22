// Step 1: Import React
import * as React from 'react';

import '../styles/index.scss';
import FrontPageLayout from '../layouts/FrontPageLayout';
import { SEO } from '../components/seo/SEO';
import { MediaContextProvider } from '../contexts/MediaBreakpoint';
import { SettingsProvider } from '../contexts/SettingsContext';

export const Head = () => <SEO title="Velkommen" />;

const IndexPage = () => {
  return (
    <SettingsProvider>
      <MediaContextProvider>
        <FrontPageLayout>Startsiden</FrontPageLayout>
      </MediaContextProvider>
    </SettingsProvider>
  );
};

export default IndexPage;
