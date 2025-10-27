import React from 'react';
import { Link as GatsbyLink } from 'gatsby';
import { PortableText as PortableTextReact } from '@portabletext/react';
import type {
  PortableTextProps,
  PortableTextReactComponents,
} from '@portabletext/react';
import {
  Heading,
  Text,
  Link as LinkText,
  UnorderedList,
  NumberedList,
  ListItem,
} from '@entur/typography/beta';
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

type ExtendedPortableTextProps = PortableTextProps & {
  npmPackage?: string;
};

const createComponents = (
  npmPackage?: string,
): Partial<PortableTextReactComponents> => ({
  block: {
    h2: ({ children, value }) => (
      <Heading as="h2" variant="title-2" id={value._key}>
        {children}
      </Heading>
    ),
    h3: ({ children, value }) => (
      <Heading as="h3" variant="subtitle-1" id={value._key}>
        {children}
      </Heading>
    ),
    h4: ({ children, value }) => (
      <Heading as="h4" variant="subtitle-2" id={value._key}>
        {children}
      </Heading>
    ),
    h5: ({ children, value }) => (
      <Heading as="h5" variant="section-1" id={value._key}>
        {children}
      </Heading>
    ),
    normal: ({ children }) => <Text variant="paragraph">{children}</Text>,
  },
  list: {
    bullet: ({ children }) => <UnorderedList>{children}</UnorderedList>,
    number: ({ children }) => <NumberedList>{children}</NumberedList>,
  },
  listItem: ({ children }) => <ListItem>{children}</ListItem>,
  marks: {
    strong: ({ children }) => (
      <Text as="strong" weight="bold">
        {children}
      </Text>
    ),
    em: ({ children }) => <Text variant="emphasized">{children}</Text>,
    link: ({ value, children }) => {
      const { href } = value;
      if (href === undefined) return null;

      try {
        const url = new URL(href);
        const internalHosts = ['linje.entur.no'];
        if (internalHosts.includes(url.host)) {
          switch (url.host) {
            case 'om.entur.no':
              return (
                <LinkText
                  as={GatsbyLink as any}
                  to={url.pathname + url.search + url.hash}
                >
                  {children}
                </LinkText>
              );
            case 'entur.no':
              return <LinkText href={href}>{children}</LinkText>;
          }
        }
      } catch (e) {
        console.error('Invalid URL:', href, e);
      }
      return (
        <LinkText external href={href} target="_blank">
          {children}
        </LinkText>
      );
    },
    code: ({ children }) => <Text variant="code-text">{children}</Text>,
  },
  types: {
    imageAndText: ImageAndTextResolver,
    media: MediaResolver,
    textBlocks: ({ value }) => (
      <TextBlocksResolver value={value} npmPackage={npmPackage} />
    ),
    link: LinkResolver,
    group: GroupResolver,
    codeExample: CodeExampleResolver,
    guideline: GuidelineResolver,
    propsTable: ({ value }) => (
      <PropsTableResolver value={value} npmPackage={npmPackage} />
    ),
    inlineIcon: ({ value }: { value: InlineIcon }) => {
      if (value.iconName === undefined || !isEnturIcon(value.iconName))
        return null;

      const IconComponent = icons[value.iconName as keyof typeof icons];
      if (!IconComponent) return null;

      return (
        <IconComponent
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
