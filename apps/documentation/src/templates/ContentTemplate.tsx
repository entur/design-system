import React, { useMemo } from 'react';
import { HeadProps, Link, graphql } from 'gatsby';
import { NavigationCard } from '@entur/layout';
import { Grid } from '@entur/layout/beta';
import { TextContainer } from '@entur/typography/beta';
import { PortableText } from '@components/sanity';
import { BasePageHeader } from '@components/PageHeader/BasePageHeader';
import { TableOfContent } from '@components/Navigations/TableOfContent/TableOfContent';
import { extractHeadings } from 'src/utils/headingIds';
import { useSetTocHeadings } from '@components/Navigations/TableOfContent/TocContext';
import { PageType } from '@components/sanity/types';
import { SEO } from '@components/seo/SEO';
import { getSanitizedPath } from '@components/Navigations/SideNavigation/utils';

type SubpageType = {
  id: string;
  title: string;
  description?: string;
  tag?: string | null;
};

export default function ContentTemplate({
  data,
}: {
  data: { page: PageType; subpages: { nodes: SubpageType[] } };
}) {
  const { page, subpages } = data;
  const {
    title,
    content,
    description,
    npmPackage,
    isCategoryLandingPage,
    tag,
    parentPage,
  } = page;
  const category = parentPage?.category ?? page.category;
  const subcategory = parentPage?.subcategory ?? page.subcategory;

  const headings = useMemo(() => extractHeadings(content), [content]);
  useSetTocHeadings(headings);

  return (
    <>
      <BasePageHeader
        category={category}
        subcategory={subcategory}
        title={title}
        description={description}
        npmPackage={npmPackage}
        isCategoryLandingPage={isCategoryLandingPage}
        tag={tag}
      />
      <TableOfContent headings={headings} variant="inline" />
      <TextContainer>
        <PortableText value={content} container={false} />
        {subpages.nodes.length > 0 && (
          <Grid templateColumns="repeat(auto-fill, minmax(16rem, 1fr))" gap="m">
            {subpages.nodes.map(subpage => (
              <NavigationCard
                key={subpage.id}
                as={Link}
                to={
                  getSanitizedPath({
                    title: subpage.title,
                    parentPage: page,
                  }) ?? ''
                }
                title={subpage.title}
              >
                {subpage.description}
              </NavigationCard>
            ))}
          </Grid>
        )}
      </TextContainer>
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
        tag?: string | null;
        parentPage?: PageType['parentPage'];
      };
    };
  },
) => {
  const { page } = props.data;
  return (
    <SEO
      title={page.title}
      description={page.description}
      pathname={getSanitizedPath({ ...page, tag: page.tag ?? undefined })}
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
      tag
      parentPage {
        title
        category
        subcategory
        tag
      }
      content {
        ...TextBlockFragment
      }
    }
    subpages: allSanityPage(
      filter: { parentPage: { id: { eq: $id } } }
      sort: { title: ASC }
    ) {
      nodes {
        id
        title
        description
        tag
      }
    }
  }
`;
