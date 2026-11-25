import React from 'react';
import { TextContainer } from '@entur/typography/beta';
import { DocH2 } from '@components/Common/DocHeadings';
import { PortableText } from './PortableText';
import { HeadingAnchor } from './HeadingAnchor';
import { HeadingIdProvider } from './HeadingIdContext';
import './DocContent.scss';

const DocSectionContent = ({
  section,
  npmPackage,
}: {
  section: { _key: string; title?: string; items?: any[] };
  npmPackage?: string;
}) => {
  if (!section.items?.length) return null;
  return (
    <>
      {section.title && (
        <HeadingAnchor
          headingKey={section._key}
          headingText={section.title}
          HeadingComponent={DocH2}
        >
          {section.title}
        </HeadingAnchor>
      )}
      <PortableText
        value={section.items}
        context={{ npmPackage }}
        container={false}
      />
    </>
  );
};

export const renderContent = ({
  value,
  context,
}: {
  value: any;
  context?: any;
}) => {
  if (!value) return null;
  if (Array.isArray(value)) {
    return (
      // One id map per tab, the same one the table of contents reads.
      <HeadingIdProvider content={value}>
        <TextContainer className="component-doc__content">
          {value.map((section: any) => (
            <DocSectionContent
              key={section._key}
              section={section}
              npmPackage={context?.npmPackage}
            />
          ))}
        </TextContainer>
      </HeadingIdProvider>
    );
  }
  return <PortableText value={value} context={context} />;
};
