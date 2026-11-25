import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab';

import { TableOfContent } from '@components/Navigations/TableOfContent/TableOfContent';
import type { TocHeading } from '@components/Navigations/TableOfContent/TableOfContent';
import { useSetTocHeadings } from '@components/Navigations/TableOfContent/TocContext';
import { TOC_MIN_DEPTH } from 'src/utils/headingIds';
import { scrollToElement } from 'src/utils/scrollUtils';

export type DocTabItem = {
  title: string;
  /** Known headings, e.g. from Sanity. Left out, they are read from the rendered tab. */
  headings?: TocHeading[];
  content: React.ReactNode;
};

const HEADING_SELECTOR = 'h2[id], h3[id], h4[id]';

// Shifts the levels so the highest heading in a tab sits at the top of the table of contents
const readHeadings = (panel: HTMLElement): TocHeading[] => {
  const found = Array.from(
    panel.querySelectorAll<HTMLElement>(HEADING_SELECTOR),
  )
    .filter(el => !el.closest('dialog, nav'))
    .map(el => ({
      id: el.id,
      title: el.textContent?.trim() ?? '',
      depth: Number(el.tagName.slice(1)),
    }))
    .filter(heading => heading.title);
  const top = Math.min(...found.map(h => h.depth));
  return found.map(h => ({ ...h, depth: h.depth - top + TOC_MIN_DEPTH }));
};

const sameHeadings = (a: TocHeading[], b: TocHeading[]) =>
  a.length === b.length &&
  a.every((h, i) => h.id === b[i].id && h.title === b[i].title);

export const DocTabs = ({ tabs }: { tabs: DocTabItem[] }) => {
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [readHeadingsByTab, setReadHeadingsByTab] = useState<TocHeading[][]>(
    () => tabs.map(() => []),
  );
  const needsReading = tabs.some(tab => tab.headings === undefined);

  // Headings of MDX content and components only exist in the DOM, so they are read and kept in sync
  useEffect(() => {
    if (!needsReading) return;
    const update = () =>
      setReadHeadingsByTab(previous => {
        const next = tabs.map((tab, index) => {
          const panel = panelRefs.current[index];
          return tab.headings ?? (panel ? readHeadings(panel) : []);
        });
        return next.every((h, i) => sameHeadings(h, previous[i] ?? []))
          ? previous
          : next;
      });
    update();
    const observer = new MutationObserver(update);
    panelRefs.current.forEach(
      panel =>
        panel && observer.observe(panel, { childList: true, subtree: true }),
    );
    return () => observer.disconnect();
  }, [tabs, needsReading]);

  const tabHeadings = useMemo(
    () =>
      tabs.map((tab, index) => tab.headings ?? readHeadingsByTab[index] ?? []),
    [tabs, readHeadingsByTab],
  );
  const headingToTab = useMemo(() => {
    const map = new Map<string, number>();
    tabHeadings.forEach((headings, index) =>
      headings.forEach(heading => map.set(heading.id, index)),
    );
    return map;
  }, [tabHeadings]);

  const [activeIndex, setActiveIndex] = useState(0);
  const shouldRenderAsTabs = tabs.length > 1;

  // Reading the hash while rendering would make the server and the client
  // disagree on the open tab, so the deep link is applied once its heading is known.
  const deepLinkApplied = useRef(false);
  const pendingHash = useRef<{ hash: string; tabIndex: number } | null>(null);
  useEffect(() => {
    if (deepLinkApplied.current) return;
    const hash = window.location.hash.substring(1);
    if (!hash) {
      deepLinkApplied.current = true;
      return;
    }
    const tabIndex = headingToTab.get(hash);
    if (tabIndex === undefined && needsReading && headingToTab.size === 0) {
      return;
    }
    deepLinkApplied.current = true;
    pendingHash.current = { hash, tabIndex: tabIndex ?? 0 };
    setActiveIndex(tabIndex ?? 0);
  }, [headingToTab, needsReading]);

  // The heading is only visible once its tab is the one being shown.
  useEffect(() => {
    const pending = pendingHash.current;
    if (!pending || pending.tabIndex !== activeIndex) return;
    pendingHash.current = null;
    requestAnimationFrame(() => scrollToElement(pending.hash));
  }, [activeIndex, headingToTab]);

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

  useSetTocHeadings(tabHeadings[activeIndex] ?? tabHeadings[0] ?? []);

  // The wrapper is only needed to read headings from the DOM
  const renderPanelContent = (tab: DocTabItem, index: number) =>
    tab.headings === undefined ? (
      <div ref={el => (panelRefs.current[index] = el)}>{tab.content}</div>
    ) : (
      tab.content
    );

  if (!shouldRenderAsTabs) {
    return (
      <>
        <TableOfContent headings={tabHeadings[0] ?? []} variant="inline" />
        {tabs[0] && renderPanelContent(tabs[0], 0)}
      </>
    );
  }

  return (
    <Tabs index={activeIndex} onChange={setActiveIndex}>
      <TabList>
        {tabs.map(tab => (
          <Tab key={tab.title}>{tab.title}</Tab>
        ))}
      </TabList>
      <TabPanels keepMounted={needsReading}>
        {tabs.map((tab, index) => (
          <TabPanel key={tab.title}>
            <TableOfContent headings={tabHeadings[index]} variant="inline" />
            {renderPanelContent(tab, index)}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

/** One tab in MDX: `<DocTab title="…">…</DocTab>` inside `<MdxDocTabs>` */
export const DocTab = ({
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => <>{children}</>;

export const MdxDocTabs = ({ children }: { children: React.ReactNode }) => {
  const tabs = useMemo(
    () =>
      React.Children.toArray(children)
        .filter(
          (
            child,
          ): child is React.ReactElement<{
            title: string;
            children?: React.ReactNode;
          }> => React.isValidElement(child) && child.type === DocTab,
        )
        .map(child => ({
          title: child.props.title,
          content: child.props.children,
        })),
    [children],
  );
  return <DocTabs tabs={tabs} />;
};
