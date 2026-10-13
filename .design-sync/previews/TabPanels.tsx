import React from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Heading3,
  Paragraph,
} from '@entur/linje';

export const Default = () => (
  <div style={{ width: 480 }}>
    <Tabs>
      <TabList aria-label="Stoppested">
        <Tab>Avganger</Tab>
        <Tab>Kart</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Heading3>Nationaltheatret</Heading3>
          <Paragraph>
            Linje 12 mot Majorstuen går om 3 min. Linje 13 mot Bekkestua går om
            7 min.
          </Paragraph>
        </TabPanel>
        <TabPanel>
          <Paragraph>Kartvisning av stoppestedet.</Paragraph>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);

export const KeepMounted = () => (
  <div style={{ width: 480 }}>
    <Tabs defaultIndex={1}>
      <TabList aria-label="Reisende">
        <Tab>Voksen</Tab>
        <Tab>Barn</Tab>
        <Tab>Honnør</Tab>
      </TabList>
      <TabPanels keepMounted>
        <TabPanel>
          <Paragraph>Voksen: 18–66 år.</Paragraph>
        </TabPanel>
        <TabPanel>
          <Paragraph>
            Barn 6–17 år reiser til redusert pris. Barn under 6 år reiser
            gratis.
          </Paragraph>
        </TabPanel>
        <TabPanel>
          <Paragraph>Honnør: fra 67 år eller med gyldig honnørbevis.</Paragraph>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);
