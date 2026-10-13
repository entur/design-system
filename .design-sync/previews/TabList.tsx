import React from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Paragraph,
} from '@entur/linje';

export const Default = () => (
  <div style={{ width: 480 }}>
    <Tabs>
      <TabList aria-label="Min side">
        <Tab>Profil</Tab>
        <Tab>Billetter</Tab>
        <Tab>Betalingskort</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Paragraph>Ola Nordmann, ola.nordmann@example.no</Paragraph>
        </TabPanel>
        <TabPanel />
        <TabPanel />
      </TabPanels>
    </Tabs>
  </div>
);

export const Fluid = () => (
  <div style={{ width: 520 }}>
    <Tabs>
      <TabList width="fluid" aria-label="Transportmiddel">
        <Tab>Tog</Tab>
        <Tab>Buss</Tab>
        <Tab>Trikk</Tab>
        <Tab>Båt</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Paragraph>Viser togavganger fra Oslo S.</Paragraph>
        </TabPanel>
        <TabPanel />
        <TabPanel />
        <TabPanel />
      </TabPanels>
    </Tabs>
  </div>
);
