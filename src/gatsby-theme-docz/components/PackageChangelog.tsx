import React, { useState } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Modal } from '@entur/modal/dist';
import { MarkdownParser } from './MarkdownParser';
import { ActionChip } from '@entur/chip/dist';
import { ExternalIcon } from '@entur/icons';
import { useGetChangelog } from './useGetChangelog';

export const PackageChangelog = ({ packageName }: { packageName: string }) => {
  const [openModal, setOpenModal] = useState(false);
  const [packageChangelog, setPackageChangelog] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const query = useGetChangelog();
  const changelog = query.allMarkdownRemark.edges.filter(
    k => k.node.parent.name === packageName,
  );

  return (
    <>
      <ActionChip
        onClick={() => {
          setPackageChangelog(changelog[0].node.rawMarkdownBody);
          setModalTitle(`@entur/${changelog[0].node.parent.name}`);
          setOpenModal(true);
        }}
      >
        Changelog
        <ExternalIcon />
      </ActionChip>

      <Modal
        onDismiss={() => setOpenModal(false)}
        title={modalTitle}
        size="large"
        open={openModal}
      >
        <MarkdownParser>{packageChangelog}</MarkdownParser>
      </Modal>
    </>
  );
};
