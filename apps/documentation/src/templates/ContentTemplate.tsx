import React from 'react';
import { graphql } from 'gatsby';
import { PortableText } from '@components/sanity';
import { BasePageHeader } from '@components/PageHeader/BasePageHeader';
import { PageType } from '@components/sanity/types';
import { SEO } from '@components/seo/SEO';
import { getSanitizedPath } from '@components/Navigations/SideNavigation/utils';

export default function ContentTemplate({
  data,
}: {
  data: { page: PageType };
}) {
  const { page } = data;
  const { title, category, subcategory, content, description, npmPackage } =
    page;

  return (
    <>
      <SEO
        title={title}
        description={description}
        pathname={getSanitizedPath({ title, category, subcategory })}
      />
      <BasePageHeader
        category={category}
        subcategory={subcategory}
        title={title}
        description={description}
        npmPackage={npmPackage}
      />
      <PortableText value={content} />
    </>
  );
}

export const query = graphql`
  query ContentBySlug($id: String!) {
    page: sanityPage(id: { eq: $id }) {
      title
      category
      subcategory
      description
      content {
        ...ImageAndTextFragment
        ...TextBlockFragment
        ...LinkFragment
        ...GroupFragment
      }
    }
  }
`;
