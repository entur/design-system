import React, { useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Modal } from '@entur/modal/dist';
import { PrimaryButton } from '@entur/button';
import { GridContainer, GridItem } from '@entur/grid';
import ReactMarkdown from 'markdown-to-jsx';
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Link,
} from '@entur/typography';

/**Must be in this (gastby-theme-docz/components) for graphql query to run */
const Changelog = () => {
  const [openModal, setOpenModal] = useState(false);
  const [packageChangelog, setPackageChangelog] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const query = useStaticQuery(graphql`
    query ChangelogsQuery {
      allMarkdownRemark {
        edges {
          node {
            html
            rawMarkdownBody
            parent {
              ... on File {
                name
              }
            }
          }
        }
      }
    }
  `);

  return (
    <div>
      <GridContainer spacing="medium">
        {query.allMarkdownRemark.edges.map(changelog => (
          <GridItem small={6} medium={4} key={changelog.node.parent.name}>
            <PrimaryButton
              onClick={() => {
                setPackageChangelog(changelog.node.rawMarkdownBody);
                setModalTitle(changelog.node.parent.name);
                setOpenModal(true);
              }}
            >
              {changelog.node.parent.name}
            </PrimaryButton>
          </GridItem>
        ))}
      </GridContainer>

      <Modal
        onDismiss={() => setOpenModal(false)}
        title={modalTitle}
        size="large"
        open={openModal}
      >
        <ReactMarkdown
          options={{
            overrides: {
              h1: {
                component: Heading3,
              },

              h2: {
                component: Heading4,
              },
              h3: {
                component: Heading5,
              },
              h4: {
                component: Heading6,
              },
              h5: {
                component: Heading5,
              },
              a: {
                component: Link,
              },
            },
          }}
        >
          {packageChangelog}
        </ReactMarkdown>
      </Modal>
    </div>
  );
};

export default Changelog;
