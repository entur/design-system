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
      <TabList aria-label="Billettinformasjon">
        <Tab>Billett</Tab>
        <Tab>Reiserute</Tab>
        <Tab>Kvittering</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Heading3>Enkeltbillett voksen</Heading3>
          <Paragraph>
            Gyldig i sone 1 til kl. 14:32 i dag. Vis billetten ved kontroll.
          </Paragraph>
        </TabPanel>
        <TabPanel>
          <Paragraph>
            Oslo S – Lillestrøm, linje L1, avgang 13:02 fra spor 4.
          </Paragraph>
        </TabPanel>
        <TabPanel>
          <Paragraph>Ordrenummer ABC123. Betalt 44 kr med Vipps.</Paragraph>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);

export const SecondTabActive = () => (
  <div style={{ width: 480 }}>
    <Tabs defaultIndex={1}>
      <TabList aria-label="Avganger">
        <Tab>Avganger</Tab>
        <Tab>Ankomster</Tab>
        <Tab>Driftsmeldinger</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Paragraph>Neste avgang fra Jernbanetorget: 13:05.</Paragraph>
        </TabPanel>
        <TabPanel>
          <Heading3>Ankomster Oslo S</Heading3>
          <Paragraph>
            F1 fra Oslo lufthavn ankommer spor 13 kl. 13:14.
          </Paragraph>
        </TabPanel>
        <TabPanel>
          <Paragraph>Ingen driftsmeldinger for øyeblikket.</Paragraph>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);
