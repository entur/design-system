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
          if (children.includes('Bug Fixes')) {
            return React.createElement(
              type,
              [props],
              // eslint-disable-next-line react/jsx-key -- disabled when we turned on linting for all files in the project
              [<BugIcon inline {...props}></BugIcon>, children],
            );
          }
          if (children.includes('Features')) {
            return React.createElement(
              type,
              [props],
              // eslint-disable-next-line react/jsx-key -- disabled when we turned on linting for all files in the project
              [<NewIcon inline {...props}></NewIcon>, children],
            );
          }
          return React.createElement(type, props, children);
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
    >
      {children}
    </ReactMarkdown>
  );
};
export const ChangelogTag = props => {
  return <Tag style={{ margin: '1rem 0 0' }}>{props.children}</Tag>;
};
