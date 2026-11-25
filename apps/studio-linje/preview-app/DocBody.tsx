import React, { useState } from 'react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@entur/tab';
import { PortableText } from '@components/sanity/PortableText';
import { renderContent } from '@components/sanity/DocContent';
import { PreviewPage } from './PreviewPage';

export type ComponentDoc = {
  _type: 'componentDoc';
  title?: string;
  subcategory?: string;
  description?: string;
  npmPackage?: string;
  intro?: unknown;
  tabs?: Array<{
    _key: string;
    title?: string;
    sections?: unknown;
    content?: unknown;
  }>;
};

// The content of a component page, without the site's menu and header
export function DocBody({ doc }: { doc: ComponentDoc }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const context = { npmPackage: doc.npmPackage };
  const selectClickedTab = (event: React.MouseEvent<HTMLElement>) => {
    const tab = (event.target as Element).closest('[role="tab"]');
    const index = [
      ...event.currentTarget.querySelectorAll('[role="tab"]'),
    ].indexOf(tab as Element);
    if (index >= 0) setActiveIndex(index);
  };
  const tabs = (doc.tabs ?? []).map(tab => ({
    key: tab._key,
    title: tab.title,
    content: tab.sections ?? tab.content ?? null,
  }));

  // A deleted tab would leave the index past the end, and no panel would render
  const selectedIndex = Math.min(activeIndex, Math.max(tabs.length - 1, 0));

  return (
    <PreviewPage
      subcategory={doc.subcategory}
      title={doc.title}
      description={doc.description}
    >
      {doc.intro ? <PortableText value={doc.intro} context={context} /> : null}
      {tabs.length > 0 && (
        <Tabs index={selectedIndex} onChange={setActiveIndex}>
          {/* The edit overlay stops the click on a tab title, so the tab is
                  picked in the capture phase, which runs first */}
          <TabList onClickCapture={selectClickedTab}>
            {tabs.map(tab => (
              <Tab key={tab.key}>{tab.title}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {tabs.map(tab => (
              <TabPanel key={tab.key}>
                {renderContent({ value: tab.content, context })}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      )}
    </PreviewPage>
  );
}
