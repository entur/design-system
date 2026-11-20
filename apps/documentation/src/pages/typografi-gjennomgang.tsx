import React from 'react';

import { SEO } from '@components/seo/SEO';
import { TypographyReview } from '@components/TypographyReview/TypographyReview';

const TypographyReviewPage = () => <TypographyReview />;

export default TypographyReviewPage;

export const Head = () => (
  <SEO title="Ny typografi til gjennomgang" pathname="/typografi-gjennomgang">
    <meta name="robots" content="noindex" />
  </SEO>
);
