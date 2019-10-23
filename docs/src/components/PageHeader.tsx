import React from 'react';
import { useCurrentDoc } from 'docz';
import copy from 'copy-text-to-clipboard';
import { useToast } from '@entur/alert';
import { ReportsIcon } from '@entur/icons';
import {
  Heading1,
  Label,
  LeadParagraph,
  PreformattedText,
} from '@entur/typography';
import { CopyablePreformattedText } from 'src/components/CopyablePreformattedText';
import { useSettings } from './SettingsContext';
import './PageHeader.scss';

type Props = {
  title?: string;
  category?: string;
};

const PageHeader: React.FC<Props> = ({ title, children, category }) => {
  const currentDoc = useCurrentDoc();
  const npmPackage: string = currentDoc.npmPackage;
  const categoryToShow = category || currentDoc.parent;
  const titleToShow = title || currentDoc.name;
  const { packageManager, userType } = useSettings();
  const installText =
    packageManager === 'yarn'
      ? `yarn add @entur/${npmPackage}`
      : `npm install @entur/${npmPackage}`;
  return (
    <header>
      {categoryToShow && <Label as="div">{categoryToShow.toUpperCase()}</Label>}
      <Heading1 style={{ marginTop: '0.3em' }}>{titleToShow}</Heading1>
      {children && <LeadParagraph>{children}</LeadParagraph>}
      {npmPackage && userType === 'developer' && (
        <CopyablePreformattedText
          copiedToastMessage={{
            title: `Kopiert!`,
            content: 'Innstalleringstekst ble kopiert til utklippstavla.',
          }}
        >
          {installText}
        </CopyablePreformattedText>
      )}
    </header>
  );
};

export default PageHeader;
