import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HeadProps, PageProps, graphql } from 'gatsby';
import { SEO } from '@components/seo/SEO';
import { getSanitizedPath } from '@components/Navigations/SideNavigation/utils';
import SanityTableOfContent from '@components/Navigations/TableOfContent/SanityTableOfContent';
import { extractHeadings } from 'src/utils/headingIds';
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
    const headings = extractHeadings(tab.content);
    headings.forEach(h => map.set(h.id, index));
  });
  return map;
};

const TabsSection = React.memo(function TabsSection({
  tabs,
  context,
}: {
  tabs: Array<{ title?: string; content?: any }>;
  context: { npmPackage?: string };
}) {
  const headingToTab = useMemo(() => buildHeadingToTabMap(tabs), [tabs]);

  const [activeIndex, setActiveIndex] = useState(0);
  const shouldRenderAsTabs = tabs.length > 1;

  // Reading the hash while rendering would have the server pick tab 0 and the
  // client pick another, so the deep link is applied once after mount instead.
  const deepLinkApplied = useRef(false);
  const pendingHash = useRef<{ hash: string; tabIndex: number } | null>(null);
  useEffect(() => {
    if (deepLinkApplied.current) return;
    deepLinkApplied.current = true;

    const hash = window.location.hash.substring(1);
    if (!hash) return;
    const tabIndex = headingToTab.get(hash) ?? 0;
    pendingHash.current = { hash, tabIndex };
    setActiveIndex(tabIndex);
  }, [headingToTab]);

  // The heading only exists once its tab is the one being rendered.
  useEffect(() => {
    const pending = pendingHash.current;
    if (!pending || pending.tabIndex !== activeIndex) return;
    pendingHash.current = null;
    requestAnimationFrame(() => scrollToElement(pending.hash));
  }, [activeIndex]);

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
    () => extractHeadings(activeContent),
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
        <HeadingAnchor
          headingKey={section._key}
          headingText={section.title}
          HeadingComponent={Heading2}
        >
          {section.title}
        </HeadingAnchor>
      )}
      <PortableText value={section.items} context={{ npmPackage }} />
    </>
  );
};

const renderContent = ({ value, context }: { value: any; context?: any }) => {
  if (!value) return null;
  if (Array.isArray(value)) {
    return (
      // One map per tab, shared with the TOC through extractHeadings.
      <HeadingIdProvider content={value}>
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
