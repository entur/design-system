import React from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import {
  Heading,
  Text,
  Link as LinkText,
  UnorderedList,
  ListItem,
} from '@entur/typography/beta';
import { Tag } from '@entur/layout';
import { NewIcon, BugIcon } from '@entur/icons';

export const MarkdownParser: React.FC<{ children: any }> = ({ children }) => {
  return (
    <ReactMarkdown
      options={{
        createElement(type, props, children) {
          const childrenArray = React.Children.toArray(children);
          const childrenText = childrenArray.join('');

          // Needs unique key to avoid React warning
          const baseKey = childrenText.substring(0, 30);
          const uniqueKey = `${baseKey}-${props.key || ''}`;

          if (childrenText.includes('Bug Fixes')) {
            return React.createElement(
              type,
              { ...props, key: `bug-fix-${uniqueKey}` },
              [
                <BugIcon inline aria-hidden="true" {...props} key="bug-icon" />,
                ...childrenArray,
              ],
            );
          }

          if (childrenText.includes('Features')) {
            return React.createElement(
              type,
              { ...props, key: `feature-${uniqueKey}` },
              [
                <NewIcon inline aria-hidden="true" {...props} key="new-icon" />,
                ...childrenArray,
              ],
            );
          }

          return React.createElement(
            type,
            { ...props, key: `generic-${uniqueKey}` },
            childrenArray,
          );
        },
        overrides: {
          h1: {
            component: (props: any) => (
              <Heading as="h1" variant="title-1" {...props} />
            ),
          },
          h2: {
            component: (props: any) => (
              <Heading as="h2" variant="title-2" {...props} />
            ),
          },
          h3: {
            component: ChangelogTag,
          },
          h4: {
            component: (props: any) => (
              <Heading as="h4" variant="subtitle-2" {...props} />
            ),
          },
          h5: {
            component: (props: any) => (
              <Heading as="h5" variant="section-1" {...props} />
            ),
          },
          a: {
            component: LinkText,
          },
          ul: {
            component: UnorderedList,
          },
          li: {
            component: ListItem,
          },
          strong: {
            component: (props: any) => (
              <Text
                as="strong"
                variant="emphasized"
                weight="semibold"
                {...props}
              />
            ),
          },
        },
      }}
      lang="en"
    >
      {children}
    </ReactMarkdown>
  );
};

export const ChangelogTag = (props: any) => {
  return (
    <Tag
      style={{
        marginTop: '1rem',
        marginBottom: '0',
        marginLeft: '0',
        marginRight: '0',
      }}
    >
      {props.children}
    </Tag>
  );
};
