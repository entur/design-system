import React, { useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Modal } from '@entur/modal/dist';
import { GridContainer, GridItem } from '@entur/grid';
import { MarkdownParser } from './MarkdownParser';
import { NavigationCard } from '@entur/layout';
import './Changelog.scss';
import { useGetChangelog } from './useGetChangelog';

/**Must be in this (gastby-theme-docz/components) for graphql query to run */
const Changelog = () => {
  const [openModal, setOpenModal] = useState(false);
  const [packageChangelog, setPackageChangelog] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const query = useGetChangelog();

  return (
    <div>
      <GridContainer spacing="medium">
        {query.allMarkdownRemark.edges.map(changelog => (
          <GridItem small={6} medium={4} key={changelog.node.parent.name}>
            <NavigationCard
              title={`@entur/${changelog.node.parent.name}`}
              compact
              as="button"
              className="changelog-navigation-card"
              style={{
                height: '5rem',
                width: '100%',
                fontFamily: 'inherit',
                background: 'none',
                cursor: 'pointer',
              }}
              onClick={() => {
                setPackageChangelog(changelog.node.rawMarkdownBody);
                setModalTitle(`@entur/${changelog.node.parent.name}`);
                setOpenModal(true);
              }}
            ></NavigationCard>
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
