import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { PortableText as PortableTextReact } from '@portabletext/react';
import type {
  PortableTextProps,
  PortableTextReactComponents,
} from '@portabletext/react';

import {
  EmphasizedText,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Link,
  ListItem,
  NumberedList,
  Paragraph,
  StrongText,
  UnorderedList,
} from '@entur/typography';
import { ImageAndTextResolver } from './image/ImageAndTextResolver';
import { TextBlocksResolver } from './TextBlocksResolver';

// TODO: Dette er direkte kopiert fra Omtur og må tilpasses masse!
const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children, value }) => (
      <Heading2 id={value._key}>{children}</Heading2>
    ),
    h3: ({ children, value }) => (
      <Heading3 id={value._key}>{children}</Heading3>
    ),
    h4: ({ children, value }) => (
      <Heading4 id={value._key}>{children}</Heading4>
    ),
    h5: ({ children, value }) => (
      <Heading5 id={value._key}>{children}</Heading5>
    ),
    normal: ({ children }) => <Paragraph>{children}</Paragraph>,
  },
  list: {
    bullet: ({ children }) => <UnorderedList>{children}</UnorderedList>,
    number: ({ children }) => <NumberedList>{children}</NumberedList>,
  },
  listItem: ({ children }) => <ListItem>{children}</ListItem>,
  marks: {
    strong: ({ children }) => <StrongText>{children}</StrongText>,
    em: ({ children }) => <EmphasizedText>{children}</EmphasizedText>,
    link: ({ value, children }) => {
      const { href } = value;
      if (href === undefined) {
        return null;
      }
      try {
        const url = new URL(href);
        const allowedHosts = ['om.entur.no', 'entur.no'];
        if (allowedHosts.includes(url.host)) {
          switch (url.host) {
            case 'om.entur.no':
              return (
                <Link as={GatsbyLink} to={url.pathname + url.search + url.hash}>
                  {children}
                </Link>
              );
            case 'entur.no':
              return <Link href={href}>{children}</Link>;
          }
        }
      } catch (e) {
        console.error('Invalid URL:', href, e);
      }
      return (
        <Link external href={href} target="_blank">
          {children}
        </Link>
      );
    },
  },
  types: {
    imageAndText: ImageAndTextResolver,
    textBlocks: TextBlocksResolver,
  },

  unknownType: ({ value }) => {
    return <p>Unknown type: {value._type}</p>;
  },
};

export const PortableText = ({ value }: PortableTextProps) => {
  return <PortableTextReact components={components} value={value} />;
};
