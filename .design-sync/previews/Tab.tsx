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
      <TabList aria-label="Reisetype">
        <Tab>Enkeltreise</Tab>
        <Tab>Tur/retur</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Paragraph>Finn reise fra Bergen stasjon.</Paragraph>
        </TabPanel>
        <TabPanel />
      </TabPanels>
    </Tabs>
  </div>
);

export const DisabledTab = () => (
  <div style={{ width: 480 }}>
    <Tabs>
      <TabList aria-label="Billettyper">
        <Tab>Enkeltbillett</Tab>
        <Tab>Periodebillett</Tab>
        <Tab disabled>Klippekort</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Paragraph>
            Enkeltbillett gjelder for én reise innen gyldighetstiden.
          </Paragraph>
        </TabPanel>
        <TabPanel />
        <TabPanel />
      </TabPanels>
    </Tabs>
  </div>
);
