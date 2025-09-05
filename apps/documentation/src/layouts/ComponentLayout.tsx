import React, { useMemo, useState } from 'react';
import { useWindowDimensions } from '@entur/utils';
import { pxToRem } from 'src/utils/utils';
import { BasePageHeader } from '@components/PageHeader/BasePageHeader';
import { BasePageHeaderProps } from '@components/PageHeader/BasePageHeader';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab';
import { PortableText } from '@components/sanity/PortableText';
import SanityTableOfContent from '@components/Navigations/TableOfContent/SanityTableOfContent';

import { KomIGang } from '../components/Common/KomIGang';

type ComponentLayoutProps = BasePageHeaderProps & {
  componentName: string;
  beskrivelse?: any;
  utvikling?: any;
  npmPackage?: string;
};

const ComponentLayout: React.FC<ComponentLayoutProps> = ({
  componentName,
  beskrivelse,
  utvikling,
  npmPackage,
  ...baseHeaderProps
}) => {
  const { width } = useWindowDimensions();
  const remWidth = pxToRem(width);
  const isLargeScreen = remWidth !== undefined && remWidth >= 60;
  const [activeTab, setActiveTab] = useState(0);

  // Get content for the currently active tab
  const currentContent = useMemo(() => {
    if (activeTab === 0) {
      return beskrivelse;
    } else {
      return utvikling;
    }
  }, [activeTab, beskrivelse, utvikling]);

  return (
    <>
      <BasePageHeader {...baseHeaderProps} npmPackage={npmPackage} />

      <main id="main">
        <Tabs
          style={{ marginRight: 'auto' }}
          onChange={index => setActiveTab(index)}
        >
          <TabList width="fluid">
            <Tab>Beskrivelse</Tab>
            <Tab>Utvikling</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {beskrivelse && (
                <>
                  <PortableText value={beskrivelse} npmPackage={npmPackage} />
                </>
              )}
            </TabPanel>
            <TabPanel>
              {utvikling && (
                <>
                  {npmPackage && <KomIGang npmPackage={npmPackage} />}
                  <PortableText value={utvikling} npmPackage={npmPackage} />
                </>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </main>
      {isLargeScreen && currentContent && (
        <SanityTableOfContent
          key={`${activeTab}-${currentContent?._key || 'default'}`}
          content={currentContent}
        />
      )}
    </>
  );
};

export default ComponentLayout;
