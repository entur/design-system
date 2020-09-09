import React, { useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Modal } from '@entur/modal/dist';
import { TertiaryButton } from '@entur/button';
import ReactMarkdown from 'markdown-to-jsx';
import {
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Link,
} from '@entur/typography';

export const PackageChangelog = ({ packageName }: { packageName: string }) => {
  const [openModal, setOpenModal] = useState(false);
  const [packageChangelog, setPackageChangelog] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const query = useStaticQuery(graphql`
    query PackageChangelog {
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
  const changelog = query.allMarkdownRemark.edges.filter(
    k => k.node.parent.name === packageName,
  );
  console.log(changelog);

  return (
    <>
      <TertiaryButton
        onClick={() => {
          setPackageChangelog(changelog[0].node.rawMarkdownBody);
          setModalTitle(changelog[0].node.parent.name);
          setOpenModal(true);
        }}
      >
        Changelog
        {/* {changelog[0].node.parent.name} */}
      </TertiaryButton>

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
                component: Heading6,
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
    </>
  );
};
