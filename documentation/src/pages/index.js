import React from 'react';
import FrontPageLayout from '../layouts/FrontPageLayout';
import { FrontPage } from '../components/FrontPage/FrontPage';
import { SEO } from '../components/seo/SEO';

export const Head = () => <SEO title="Velkommen" />;

const IndexPage = () => {
  return (
    <FrontPageLayout>
      <FrontPage />
    </FrontPageLayout>
  );
};

export default IndexPage;
