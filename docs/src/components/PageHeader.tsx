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
import { useSettings } from './SettingsContext';
import './PageHeader.scss';

type Props = {
  title?: string;
  category?: string;
};

const PageHeader: React.FC<Props> = ({ title, children, category }) => {
  const { addToast } = useToast();
  const currentDoc = useCurrentDoc();
  const npmPackage: string = currentDoc.npmPackage;
  const categoryToShow = category || currentDoc.parent;
  const titleToShow = title || currentDoc.name;
  const { packageManager, userType } = useSettings();
  const installText =
    packageManager === 'yarn'
      ? `yarn add @entur/${npmPackage}`
      : `npm install @entur/${npmPackage}`;

  const handleInstallClick = () => {
    copy(installText);
    addToast({
      title: `Innstalleringstekst kopiert!`,
      content: 'Du finner den i utklippstavla',
    });
  };
  return (
    <header>
      {categoryToShow && <Label as="div">{categoryToShow.toUpperCase()}</Label>}
      <Heading1 style={{ marginTop: '0.3em' }}>{titleToShow}</Heading1>
      {children && <LeadParagraph>{children}</LeadParagraph>}
      {npmPackage && userType === 'developer' && (
        <PreformattedText
          onClick={handleInstallClick}
          className="page-header__install-text"
        >
          {npmPackage && installText}
          <ReportsIcon inline />
        </PreformattedText>
      )}
    </header>
  );
};

export default PageHeader;
