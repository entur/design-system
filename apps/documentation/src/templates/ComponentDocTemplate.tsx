import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HeadProps, PageProps, graphql } from 'gatsby';
import { SEO } from '@components/seo/SEO';
import { getSanitizedPath } from '@components/Navigations/SideNavigation/utils';
import SanityTableOfContent from '@components/Navigations/TableOfContent/SanityTableOfContent';
import { extractHeadingsFromPortableText } from '@components/Navigations/TableOfContent/SanityTableOfContent';
import { useSetTocHeadings } from '@components/Navigations/TableOfContent/TocContext';
import { BasePageHeader } from '@components/PageHeader/BasePageHeader';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab';
import { Heading2 } from '@entur/typography';
import { PortableText } from '@components/sanity/PortableText';
import { HeadingAnchor } from '@components/sanity/HeadingAnchor';
import { HeadingIdProvider } from '@components/sanity/HeadingIdContext';
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

  const rawTabs =
    tabs && tabs.length > 0
      ? tabs
      : [
          { title: 'Beskrivelse', _rawContent: beskrivelse },
          { title: 'Utvikling', _rawContent: utvikling },
        ];

  const tabsBackwardsCompatible = rawTabs.map(tab => ({
    title: tab.title,
    content: tab._rawSections ?? tab._rawContent ?? null,
  }));

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
      <TabsSection tabs={tabsBackwardsCompatible} context={{ npmPackage }} />
    </>
  );
}

const buildHeadingToTabMap = (
  tabs: Array<{ title?: string; content?: any }>,
): Map<string, number> => {
  const map = new Map<string, number>();
  tabs.forEach((tab, index) => {
    const headings = extractHeadingsFromPortableText(tab.content);
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
  tabs: Array<{ title?: string; content?: any }>;
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

  const activeContent = tabs[activeIndex]?.content ?? tabs[0]?.content;
  const activeHeadings = useMemo(
    () => extractHeadingsFromPortableText(activeContent),
    [activeContent],
  );
  useSetTocHeadings(activeHeadings);

  return (
    <>
      {shouldRenderAsTabs ? (
        <Tabs index={activeIndex} onChange={setActiveIndex}>
          <TabList>
            {tabs.map(tab => (
              <Tab key={`${tab.title}`}>{tab.title}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {tabs.map(tab => (
              <TabPanel key={`${tab.title}`}>
                {tab.content && <SanityTableOfContent content={tab.content} />}
                {renderContent({ value: tab.content, context })}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ) : (
        <>
          {tabs[0]?.content && (
            <SanityTableOfContent content={tabs[0].content} />
          )}
          {renderContent({ value: tabs[0]?.content, context })}
        </>
      )}
    </>
  );
});

const DocSectionContent = ({
  section,
  npmPackage,
}: {
  section: { _key: string; title?: string; items?: any[] };
  npmPackage?: string;
}) => {
  if (!section.items?.length) return null;
  return (
    <>
      {section.title && (
        <HeadingAnchor headingText={section.title} HeadingComponent={Heading2}>
          {section.title}
        </HeadingAnchor>
      )}
      <PortableText
        value={section.items}
        context={{ npmPackage }}
        sharedHeadingIds
      />
    </>
  );
};

const renderContent = ({ value, context }: { value: any; context?: any }) => {
  if (!value) return null;
  if (Array.isArray(value)) {
    return (
      // One counter per tab, matching extractHeadingsFromPortableText's ids —
      // otherwise duplicate section titles collide with the TOC's deduped one.
      <HeadingIdProvider>
        {value.map((section: any) => (
          <DocSectionContent
            key={section._key}
            section={section}
            npmPackage={context?.npmPackage}
          />
        ))}
      </HeadingIdProvider>
    );
  }
  return <PortableText value={value} context={context} />;
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
