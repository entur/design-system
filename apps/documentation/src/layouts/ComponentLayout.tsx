import React from 'react';
import { BasePageHeader } from '@components/PageHeader/BasePageHeader';
import { BasePageHeaderProps } from '@components/PageHeader/BasePageHeader';
import { Heading2 } from '@entur/typography';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab';
import { PortableText } from '@components/sanity/PortableText';

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
  return (
    <>
      <BasePageHeader {...baseHeaderProps} npmPackage={npmPackage} />

      <Tabs style={{ marginRight: 'auto' }}>
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
    </>
  );
};

export default ComponentLayout;
