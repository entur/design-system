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
  const changelog = query.allMdx.nodes.filter(node => {
    return node.parent?.name == packageName;
  });
  return (
    <>
      <ActionChip
        onClick={() => {
          setPackageChangelog(changelog[0].body);
          setModalTitle(`@entur/${changelog[0].parent.name}`);
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
