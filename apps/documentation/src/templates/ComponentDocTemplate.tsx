import React from 'react';
import { HeadProps, PageProps, graphql } from 'gatsby';
import { SEO } from '@components/seo/SEO';
import { getSanitizedPath } from '@components/Navigations/SideNavigation/utils';
import SanityTableOfContent from '@components/Navigations/TableOfContent/SanityTableOfContent';
import { BasePageHeader } from '@components/PageHeader/BasePageHeader';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab';
import { PortableText } from '@components/sanity/PortableText';
import { useWindowDimensions } from '@entur/utils';
import { pxToRem } from 'src/utils/utils';

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
    intro,
    tag,
    beskrivelse,
    utvikling,
    tabs,
  } = data.sanityComponentDoc;

  const tabsBackwardsCompatible =
    tabs && tabs.length > 0
      ? tabs
      : [
          { title: 'Beskrivelse', _rawContent: beskrivelse },
          { title: 'Utvikling', _rawContent: utvikling },
        ];

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
      {renderContent({ value: intro, context: { npmPackage } })}
      <TabsSection tabs={tabsBackwardsCompatible} context={{ npmPackage }} />
    </>
  );
}

const TabsSection = React.memo(function TabsSection({
  tabs,
  context,
}: {
  tabs: Array<{ title?: string; _rawContent?: any }>;
  context: { npmPackage?: string };
}) {
  const { width: viewportWidth } = useWindowDimensions();
  const [activeTab, setActiveTab] = React.useState(0);

  const activeTabItem = tabs[activeTab];
  const shouldRenderAsTabs = tabs.length > 1;
  const isLargeScreen = (pxToRem(viewportWidth) ?? 0) >= 60;

  return (
    <>
      {shouldRenderAsTabs ? (
        <Tabs style={{ marginRight: 'auto' }} onChange={setActiveTab}>
          <TabList width="fluid">
            {tabs.map(tab => (
              <Tab key={`${tab.title}`}>{tab.title}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {tabs.map(tab => (
              <TabPanel key={`${tab.title}`}>
                {renderContent({ value: tab._rawContent, context })}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ) : (
        renderContent({ value: tabs[0]?._rawContent, context })
      )}
      {isLargeScreen && activeTabItem?._rawContent && (
        <SanityTableOfContent content={activeTabItem._rawContent} />
      )}
    </>
  );
});

const renderContent = ({ value, context }: { value: any; context?: any }) => {
  return value && <PortableText value={value} context={context} />;
};

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
