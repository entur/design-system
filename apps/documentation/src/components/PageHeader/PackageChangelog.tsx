import React, { useState } from 'react';
import { Modal } from '@entur/modal/dist';
import { MarkdownParser } from './MarkdownParser';
import { ActionChip } from '@entur/chip/dist';
import { ListViewIcon } from '@entur/icons';
import { useGetChangelog } from './useGetChangelog';

export const PackageChangelog = ({ packageName }: { packageName: string }) => {
  const [openModal, setOpenModal] = useState(false);
  const [packageChangelog, setPackageChangelog] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const query = useGetChangelog();
  const changelog = query.allFile.nodes.filter(node => {
    return node.name == packageName;
  });
  const changelogbody = changelog[0].children[0].body;
  return (
    <>
      <ActionChip
        onClick={() => {
          setPackageChangelog(changelogbody);
          setModalTitle(`@entur/${changelog[0].name}`);
          setOpenModal(true);
        }}
      >
        Changelog
        <ListViewIcon />
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
