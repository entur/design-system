import React from 'react';
import { Modal } from '@entur/modal';
import { Paragraph } from '@entur/typography';
import { PrimaryButton } from '@entur/button';
import ReactMarkdown from 'react-markdown';

type PackageChangelogProps = {
  packageName: string;
};

export const PackageChangelog: React.FC<PackageChangelogProps> = ({
  packageName,
}) => {
  const [openModal, setOpenModal] = React.useState(false);
  const [markdown, setMarkdown] = React.useState('');
  const ChangelogFilePath = `../../packages/${packageName}/CHANGELOG.md`;

  return (
    <div>
      <Modal
        open={openModal}
        onDismiss={() => setOpenModal(false)}
        title="Her er en modal"
        size="medium"
      >
        <Paragraph>
          {/* <div dangerouslySetInnerHTML={{ __html: markdown }}></div> */}
        </Paragraph>
      </Modal>
      <PrimaryButton onClick={() => setOpenModal(!openModal)}>
        Lukk
      </PrimaryButton>
    </div>
  );
};
