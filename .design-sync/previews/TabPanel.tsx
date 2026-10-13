import React from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Heading3,
  Paragraph,
  PrimaryButton,
} from '@entur/linje';

export const Default = () => (
  <div style={{ width: 480 }}>
    <Tabs>
      <TabList aria-label="Billett">
        <Tab>Detaljer</Tab>
        <Tab>Vilkår</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Heading3>Periodebillett 30 dager</Heading3>
          <Paragraph>
            Gyldig i sone 1 og 2V fra 1. oktober til 30. oktober.
          </Paragraph>
          <PrimaryButton>Forny billett</PrimaryButton>
        </TabPanel>
        <TabPanel>
          <Paragraph>
            Billetten kan refunderes innen 24 timer etter kjøp.
          </Paragraph>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);

export const SecondTabActive = () => (
  <div style={{ width: 480 }}>
    <Tabs defaultIndex={1}>
      <TabList aria-label="Billett">
        <Tab>Detaljer</Tab>
        <Tab>Vilkår</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Paragraph>Periodebillett 30 dager, sone 1.</Paragraph>
        </TabPanel>
        <TabPanel>
          <Heading3>Refusjon og endring</Heading3>
          <Paragraph>
            Billetten kan refunderes innen 24 timer etter kjøp, så lenge den
            ikke er aktivert.
          </Paragraph>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
);
