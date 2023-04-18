import React, { useState } from 'react';

import { GridContainer, GridItem } from '@entur/grid';
import { Modal } from '@entur/modal';
import { Link } from '@entur/typography';

import { MarkdownParser } from './MarkdownParser';
import { useGetChangelog } from './useGetChangelog';

import './Changelog.scss';

/**Must be in this (gastby-theme-docz/components) for graphql query to run */
const Changelog = () => {
  const [openModal, setOpenModal] = useState(false);
  const [packageChangelog, setPackageChangelog] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const query = useGetChangelog();

  return (
    <div>
      <GridContainer spacing="medium">
        {query.allMarkdownRemark.edges
          .sort((a, b) => a.node.parent.name.localeCompare(b.node.parent.name))
          .map(changelog => (
            <GridItem small={6} medium={4} key={changelog.node.parent.name}>
              <Link
                as="button"
                className="changelog-link"
                onClick={() => {
                  setPackageChangelog(changelog.node.rawMarkdownBody);
                  setModalTitle(`@entur/${changelog.node.parent.name}`);
                  setOpenModal(true);
                }}
              >
                {`@entur/${changelog.node.parent.name}`}
              </Link>
            </GridItem>
          ))}
      </GridContainer>

      <Modal
        onDismiss={() => setOpenModal(false)}
        title={modalTitle}
        size="large"
        open={openModal}
      >
        <MarkdownParser>{packageChangelog}</MarkdownParser>
      </Modal>
    </div>
  );
};

export default Changelog;
