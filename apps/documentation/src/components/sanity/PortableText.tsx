import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { PortableText as PortableTextReact } from '@portabletext/react';
import type {
  PortableTextProps,
  PortableTextReactComponents,
} from '@portabletext/react';
import {
  CodeText,
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
import * as icons from '@entur/icons';

import { ImageAndTextResolver } from './image/ImageAndTextResolver';
import { TextBlocksResolver } from './text/TextBlocksResolver';
import { LinkResolver } from './text/LinkResolver';
import { GroupResolver } from './layout/GroupResolver';
import { CodeExampleResolver } from './CodeExampleResolver';
import { DoDontResolver } from './DoDontResolver';
import { PropsTableResolver } from './PropsTableResolver';
import { CopyableTextResolver } from './CopyableTextResolver';
import { InlineIcon } from './types';
import { isEnturIcon } from 'src/utils/utils';

type ExtendedPortableTextProps = PortableTextProps & {
  npmPackage?: string;
};

const createComponents = (
  npmPackage?: string,
): Partial<PortableTextReactComponents> => ({
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
        // console.error('Invalid URL:', href, e);
      }
      return (
        <Link external href={href} target="_blank">
          {children}
        </Link>
      );
    },
    code: ({ children }) => <CodeText>{children}</CodeText>,
  },
  types: {
    imageAndText: ImageAndTextResolver,
    textBlocks: ({ value }) => (
      <TextBlocksResolver value={value} npmPackage={npmPackage} />
    ),
    link: LinkResolver,
    group: GroupResolver,
    codeExample: CodeExampleResolver,
    doDontGroup: DoDontResolver,
    propsTable: PropsTableResolver,
    copyableText: CopyableTextResolver,
    inlineIcon: ({ value }: { value: InlineIcon }) => {
      if (value.iconName === undefined || !isEnturIcon(value.iconName))
        return null;

      const Icon = icons[value.iconName];
      return (
        <Icon
          inline
          aria-hidden={value.hideFromScreenreaders}
          aria-label={value.iconDescription}
        />
      );
    },
  },

  unknownType: ({ value }) => <p>Unknown type: {value._type}</p>,
});

export const PortableText = ({
  value,
  npmPackage,
}: ExtendedPortableTextProps) => {
  return (
    <PortableTextReact
      components={createComponents(npmPackage)}
      value={value}
    />
  );
};
