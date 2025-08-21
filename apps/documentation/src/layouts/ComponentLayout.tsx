import React from 'react';
import { BasePageHeader } from '@components/PageHeader/BasePageHeader';

import { BasePageHeaderProps } from '@components/PageHeader/BasePageHeader';
import KomIGang from '@components/Komponenter/KomIGang';
import { Heading2 } from '@entur/typography';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab';
import Props from '@components/Props/Props';
import Playground from '@components/Playground/Playground';

// for test
import { standardknapper } from '@data/props/button-props.tsx';

type ComponentLayoutProps = BasePageHeaderProps & {};

const ComponentLayout: React.FC<ComponentLayoutProps> = ({
  ...baseHeaderProps
}) => {
  return (
    <>
      <BasePageHeader {...baseHeaderProps} />
      <Tabs style={{ marginRight: 'auto' }}>
        <TabList width="fluid">
          <Tab>Beskrivelse</Tab>
          <Tab>Utvikling</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Heading2>Live demo</Heading2>
            <Playground props={standardknapper} code={`<Button></Button>`} />
          </TabPanel>
          <TabPanel>
            <KomIGang npmPackage={baseHeaderProps.npmPackage}></KomIGang>
            <Heading2>Komponentprops</Heading2>
            <Props componentName="Button" />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default ComponentLayout;
