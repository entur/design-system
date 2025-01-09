import React, { useState } from 'react';

import { GridContainer, GridItem } from '@entur/grid';
import { Modal } from '@entur/modal';
import { Link as LinkText } from '@entur/typography';

import { MarkdownParser } from '../PageHeader/MarkdownParser';
import { useGetChangelog } from '../PageHeader/useGetChangelog';

import './Changelog.scss';

const Changelog = () => {
  const [openModal, setOpenModal] = useState(false);
  const [packageChangelog, setPackageChangelog] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const query = useGetChangelog();

  const changelogs = query?.allFile?.nodes || [];

  return (
    <div>
      <GridContainer spacing="medium">
        {changelogs.length === 0 ? (
          <p>No changelogs found.</p>
        ) : (
          changelogs
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort changelogs by name
            .map((changelog, index) => (
              <GridItem small={6} medium={4} key={`${changelog.name}-${index}`}>
                <LinkText
                  as="button"
                  className="changelog-link"
                  onClick={() => {
                    fetch(changelog.publicURL)
                      .then(response => response.text())
                      .then(body => {
                        setPackageChangelog(body);
                        setModalTitle(`@entur/${changelog.name}`);
                        setOpenModal(true);
                      });
                  }}
                >
                  {`@entur/${changelog.name}`}
                </LinkText>
              </GridItem>
            ))
        )}
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
