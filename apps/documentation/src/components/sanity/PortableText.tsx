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
import { MediaResolver } from './media/MediaResolver';
import { TextBlocksResolver } from './text/TextBlocksResolver';
import { LinkResolver } from './text/LinkResolver';
import { GroupResolver } from './layout/GroupResolver';
import { CodeExampleResolver } from './CodeExampleResolver';
import { GuidelineResolver } from './GuidelineResolver';
import { PropsTableResolver } from './PropsTableResolver';
import { InlineIcon } from './types';
import { isEnturIcon } from 'src/utils/utils';
import { HeadingAnchor } from './HeadingAnchor';
import { HeadingIdProvider } from './HeadingIdContext';

const getBlockText = (value: any) =>
  value.children?.map((c: any) => c.text || '').join('') || '';

const createComponents = (context?: {
  npmPackage?: string;
}): Partial<PortableTextReactComponents> => ({
  block: {
    h2: ({ children, value }) => (
      <HeadingAnchor
        headingText={getBlockText(value)}
        HeadingComponent={Heading2}
      >
        {children}
      </HeadingAnchor>
    ),
    h3: ({ children, value }) => (
      <HeadingAnchor
        headingText={getBlockText(value)}
        HeadingComponent={Heading3}
      >
        {children}
      </HeadingAnchor>
    ),
    h4: ({ children, value }) => (
      <HeadingAnchor
        headingText={getBlockText(value)}
        HeadingComponent={Heading4}
      >
        {children}
      </HeadingAnchor>
    ),
    h5: ({ children, value }) => (
      <HeadingAnchor
        headingText={getBlockText(value)}
        HeadingComponent={Heading5}
      >
        {children}
      </HeadingAnchor>
    ),
    normal: ({ children }) => <Paragraph>{children}</Paragraph>,
  },
  list: {
    bullet: ({ children }) => <UnorderedList>{children}</UnorderedList>,
    number: ({ children, value }) => {
      const typeByLevel: Record<number, '1' | 'a' | 'i'> = {
        1: '1',
        2: 'a',
        3: 'i',
      };
      const type = typeByLevel[value.level] ?? '1';
      return <NumberedList type={type}>{children}</NumberedList>;
    },
  },
  listItem: ({ children }) => <ListItem>{children}</ListItem>,
  marks: {
    strong: ({ children }) => <StrongText>{children}</StrongText>,
    em: ({ children }) => <EmphasizedText>{children}</EmphasizedText>,
    link: ({ value, children }) => {
      const { href } = value;
      if (href === undefined) return null;

      // Relative paths and anchor-only links are internal links
      if (href.startsWith('/') || href.startsWith('#')) {
        return (
          <Link as={GatsbyLink as any} to={href}>
            {children}
          </Link>
        );
      }

      try {
        const url = new URL(href);
        const internalHosts = ['linje.entur.no'];
        if (internalHosts.includes(url.host)) {
          return (
            <Link
              as={GatsbyLink as any}
              to={url.pathname + url.search + url.hash}
            >
              {children}
            </Link>
          );
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
    code: ({ children }) => <CodeText>{children}</CodeText>,
  },
  types: {
    imageAndText: ImageAndTextResolver,
    media: MediaResolver,
    textBlocks: ({ value }) => (
      <TextBlocksResolver value={value} npmPackage={context?.npmPackage} />
    ),
    link: LinkResolver,
    group: GroupResolver,
    codeExample: CodeExampleResolver,
    guideline: GuidelineResolver,
    propsTable: ({ value }) => (
      <PropsTableResolver value={value} npmPackage={context?.npmPackage} />
    ),
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

type ExtendedPortableTextProps = PortableTextProps & {
  context?: {
    npmPackage?: string;
  };
};

export const PortableText = ({ value, context }: ExtendedPortableTextProps) => {
  return (
    <HeadingIdProvider>
      <PortableTextReact components={createComponents(context)} value={value} />
    </HeadingIdProvider>
  );
};
