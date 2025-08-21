import React from 'react';
import { BasePageHeader } from '@components/PageHeader/BasePageHeader';
import { BasePageHeaderProps } from '@components/PageHeader/BasePageHeader';
import KomIGang from '@components/Komponenter/KomIGang';
import { Heading2, Link } from '@entur/typography';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@entur/tab';
import Props from '@components/Props/Props';
import { PortableText } from '@components/sanity/PortableText';
import { UnorderedList, ListItem } from '@entur/typography';

type ComponentLayoutProps = BasePageHeaderProps & {
  componentName: string;
  beskrivelse?: any;
  utvikling?: any;
  relatedComponents?: Array<{
    title: string;
    link: string;
  }>;
};

const ComponentLayout: React.FC<ComponentLayoutProps> = ({
  componentName,
  beskrivelse,
  utvikling,
  relatedComponents,
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
            {beskrivelse && (
              <>
                <Heading2>Beskrivelse</Heading2>
                <PortableText value={beskrivelse} />
              </>
            )}

            {relatedComponents && relatedComponents.length > 0 && (
              <>
                <Heading2>Relaterte komponenter</Heading2>
                <UnorderedList>
                  {relatedComponents.map((component, index) => (
                    <ListItem key={index}>
                      <Link href={component.link} external>
                        {component.title}
                      </Link>
                    </ListItem>
                  ))}
                </UnorderedList>
              </>
            )}
          </TabPanel>
          <TabPanel>
            {utvikling && (
              <>
                <Heading2>Utvikling</Heading2>
                <PortableText value={utvikling} />
              </>
            )}
            <KomIGang npmPackage={baseHeaderProps.npmPackage}></KomIGang>
            <Heading2>Komponentprops</Heading2>
            <Props componentName={componentName} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default ComponentLayout;
