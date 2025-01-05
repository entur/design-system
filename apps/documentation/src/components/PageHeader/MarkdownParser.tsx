import React from 'react';
import ReactMarkdown from 'markdown-to-jsx';
import {
  Heading3,
  Heading4,
  Heading6,
  Link,
  UnorderedList,
  ListItem,
  StrongText,
} from '@entur/typography';
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
            component: Heading3,
          },
          h2: {
            component: Heading4,
          },
          h3: {
            component: ChangelogTag,
          },
          h4: {
            component: Heading6,
          },
          h5: {
            component: Heading6,
          },
          a: {
            component: Link,
          },
          ul: {
            component: UnorderedList,
          },
          li: {
            component: ListItem,
          },
          strong: {
            component: StrongText,
          },
        },
      }}
      lang="en"
    >
      {children}
    </ReactMarkdown>
  );
};

export const ChangelogTag = props => {
  return <Tag style={{ margin: '1rem 0 0' }}>{props.children}</Tag>;
};
