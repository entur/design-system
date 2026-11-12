import React, { useMemo } from 'react';
import { HeadProps, PageProps, graphql } from 'gatsby';
import { SEO } from '@components/seo/SEO';
import { getSanitizedPath } from '@components/Navigations/SideNavigation/utils';
import { extractHeadings } from 'src/utils/headingIds';
import { BasePageHeader } from '@components/PageHeader/BasePageHeader';
import { DocTabs } from '@components/DocTabs/DocTabs';
import { PortableText } from '@components/sanity/PortableText';
import { renderContent } from '@components/sanity/DocContent';

type ComponentDoc = {
  title: string;
  category?: string;
  subcategory?: string;
  description?: string;
  npmPackage?: string;
  figmaLink?: string;
  tag?: string;
  intro?: any;
  beskrivelse?: any;
  utvikling?: any;
  tabs?: Array<{
    title?: string;
    _rawSections?: any;
    _rawContent?: any;
  }>;
};

export default function ComponentDocTemplate({
  data,
}: PageProps & {
  data: {
    sanityComponentDoc: ComponentDoc;
  };
}) {
  const {
    title,
    category,
    subcategory,
    description,
    npmPackage,
    figmaLink,
    tag,
    intro,
    beskrivelse,
    utvikling,
    tabs,
  } = data.sanityComponentDoc;

  // Memoised so TabsSection, and the DocTabs effects under it, only rerun when the content changes
  const tabsBackwardsCompatible = useMemo(() => {
    const rawTabs =
      tabs && tabs.length > 0
        ? tabs
        : [
            { title: 'Beskrivelse', _rawContent: beskrivelse },
            { title: 'Utvikling', _rawContent: utvikling },
          ];
    return rawTabs.map(tab => ({
      title: tab.title,
      content: tab._rawSections ?? tab._rawContent ?? null,
    }));
  }, [tabs, beskrivelse, utvikling]);

  const headerProps = {
    title,
    category,
    subcategory,
    description,
    npmPackage,
    figmaLink,
    tag,
  };

  return (
    <>
      <BasePageHeader {...headerProps} />
      {intro && <PortableText value={intro} context={{ npmPackage }} />}
      <TabsSection tabs={tabsBackwardsCompatible} npmPackage={npmPackage} />
    </>
  );
}

const TabsSection = React.memo(function TabsSection({
  tabs,
  npmPackage,
}: {
  tabs: Array<{ title?: string; content?: any }>;
  npmPackage?: string;
}) {
  const docTabs = useMemo(
    () =>
      tabs.map(tab => ({
        title: tab.title ?? '',
        headings: extractHeadings(tab.content),
        content: renderContent({ value: tab.content, context: { npmPackage } }),
      })),
    [tabs, npmPackage],
  );
  return <DocTabs tabs={docTabs} />;
});

export const Head = (
  props: HeadProps & {
    data: {
      sanityComponentDoc: {
        title: string;
        description: string;
        category: string;
        subcategory: string;
      };
    };
  },
) => {
  const {
    data: {
      sanityComponentDoc: { title, description, category, subcategory },
    },
  } = props;
  return (
    <SEO
      title={title}
      description={description}
      pathname={getSanitizedPath({ title, category, subcategory })}
    />
  );
};

export const query = graphql`
  query ComponentDocById($id: String!) {
    sanityComponentDoc(id: { eq: $id }) {
      title
      category
      subcategory
      description
      npmPackage
      figmaLink
      tag
      intro {
        ...TextBlockFragment
      }
      tabs {
        title
        _rawSections
        _rawContent(resolveReferences: { maxDepth: 10 })
      }
      beskrivelse {
        ...TextBlockFragment
      }
      utvikling {
        ...TextBlockFragment
      }
    }
  }
`;
