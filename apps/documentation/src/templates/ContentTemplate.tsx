import React from 'react';
import { graphql, HeadProps } from 'gatsby';
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
  const {
    title,
    category,
    subcategory,
    content,
    description,
    npmPackage,
    isCategoryLandingPage,
  } = page;

  return (
    <>
      <BasePageHeader
        category={category}
        subcategory={subcategory}
        title={title}
        description={description}
        npmPackage={npmPackage}
        isCategoryLandingPage={isCategoryLandingPage}
      />
      <PortableText value={content} />
    </>
  );
}

export const Head = (
  props: HeadProps & {
    data: {
      page: {
        title: string;
        description: string;
        category: string;
        subcategory: string;
        isCategoryLandingPage: boolean;
      };
    };
  },
) => {
  const {
    data: {
      page: {
        title,
        description,
        category,
        subcategory,
        isCategoryLandingPage,
      },
    },
  } = props;
  return (
    <SEO
      title={title}
      description={description}
      pathname={getSanitizedPath({
        title,
        category,
        subcategory,
        isCategoryLandingPage,
      })}
    />
  );
};

export const query = graphql`
  query ContentBySlug($id: String!) {
    page: sanityPage(id: { eq: $id }) {
      title
      category
      subcategory
      description
      isCategoryLandingPage
      content {
        ...TextBlockFragment
      }
    }
  }
`;
