import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HeadProps, PageProps, graphql } from 'gatsby';
import { SEO } from '@components/seo/SEO';
import { getSanitizedPath } from '@components/Navigations/SideNavigation/utils';
import SanityTableOfContent from '@components/Navigations/TableOfContent/SanityTableOfContent';
import { extractHeadingsFromPortableText } from '@components/Navigations/TableOfContent/SanityTableOfContent';
import { useSetTocHeadings } from '@components/Navigations/TableOfContent/TocContext';
import { BasePageHeader } from '@components/PageHeader/BasePageHeader';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab';
import { PortableText } from '@components/sanity/PortableText';
import { scrollToElement } from '../utils/scrollUtils';

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

const buildHeadingToTabMap = (
  tabs: Array<{ title?: string; _rawContent?: any }>,
): Map<string, number> => {
  const map = new Map<string, number>();
  tabs.forEach((tab, index) => {
    const headings = extractHeadingsFromPortableText(tab._rawContent);
    headings.forEach(h => map.set(h.id, index));
  });
  return map;
};

const getInitialTabIndex = (headingToTab: Map<string, number>): number => {
  if (typeof window === 'undefined') return 0;
  const hash = window.location.hash.substring(1);
  if (!hash) return 0;
  return headingToTab.get(hash) ?? 0;
};

const TabsSection = React.memo(function TabsSection({
  tabs,
  context,
}: {
  tabs: Array<{ title?: string; _rawContent?: any }>;
  context: { npmPackage?: string };
}) {
  const headingToTab = useMemo(() => buildHeadingToTabMap(tabs), [tabs]);

  const [activeIndex, setActiveIndex] = useState(() =>
    getInitialTabIndex(headingToTab),
  );
  const shouldRenderAsTabs = tabs.length > 1;

  const scrollToHash = useCallback(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      requestAnimationFrame(() => scrollToElement(hash));
    }
  }, []);

  useEffect(() => {
    scrollToHash();
  }, [scrollToHash]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (!hash) return;
      const tabIndex = headingToTab.get(hash);
      if (tabIndex !== undefined && tabIndex !== activeIndex) {
        setActiveIndex(tabIndex);
        requestAnimationFrame(() => scrollToElement(hash));
      } else {
        scrollToElement(hash);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [headingToTab, activeIndex]);

  const activeContent = tabs[activeIndex]?._rawContent ?? tabs[0]?._rawContent;
  const activeHeadings = useMemo(
    () => extractHeadingsFromPortableText(activeContent),
    [activeContent],
  );
  useSetTocHeadings(activeHeadings);

  return (
    <>
      {shouldRenderAsTabs ? (
        <Tabs index={activeIndex} onChange={setActiveIndex}>
          <TabList width="fluid">
            {tabs.map(tab => (
              <Tab key={`${tab.title}`}>{tab.title}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {tabs.map(tab => (
              <TabPanel key={`${tab.title}`}>
                {tab._rawContent && (
                  <SanityTableOfContent content={tab._rawContent} />
                )}
                {renderContent({ value: tab._rawContent, context })}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ) : (
        <>
          {tabs[0]?._rawContent && (
            <SanityTableOfContent content={tabs[0]._rawContent} />
          )}
          {renderContent({ value: tabs[0]?._rawContent, context })}
        </>
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
