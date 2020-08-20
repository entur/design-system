import React from 'react';
import { useCurrentDoc } from 'docz';
import { Heading1, Label, LeadParagraph } from '@entur/typography';
import { CopyablePreformattedText } from '~/components/CopyablePreformattedText';
import { useSettings } from './SettingsContext';
import './PageHeader.scss';

type Props = {
  category?: string;
  forceNoLeadText?: boolean;
  title?: string;
};

const PageHeader: React.FC<Props> = ({
  title,
  children,
  category,
  forceNoLeadText,
}) => {
  const currentDoc = useCurrentDoc();
  const npmPackage: string = currentDoc.npmPackage;
  const categoryToShow = category || currentDoc.parent;
  const titleToShow = title || currentDoc.name;
  const { packageManager, userType } = useSettings();
  const leadText = forceNoLeadText ? null : children || currentDoc.description;
  const installText =
    packageManager === 'yarn'
      ? `yarn add @entur/${npmPackage}`
      : `npm install @entur/${npmPackage}`;
  const cssImport = `@import '~@entur/${npmPackage}/dist/styles.css';`;
  return (
    <header>
      {categoryToShow && (
        <Label as="div" style={{ letterSpacing: '1px' }}>
          {categoryToShow.toUpperCase()}
        </Label>
      )}
      <Heading1 style={{ marginTop: '0.3em' }}>
        {titleToShow}
        {npmPackage && userType === 'developer' && (
          <>
            <button style={{ float: 'right' }}>changelog</button>
            <img
              alt="npm"
              style={{ float: 'right' }}
              src={`https://img.shields.io/npm/v/@entur/${npmPackage}?color=181c56&style=flat-square`}
            ></img>
          </>
        )}
      </Heading1>
      {leadText && <LeadParagraph>{leadText}</LeadParagraph>}
      {npmPackage && userType === 'developer' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <CopyablePreformattedText successMessage="Innstalleringstekst ble kopiert til utklippstavla.">
              {installText}
            </CopyablePreformattedText>
            <CopyablePreformattedText successMessage="CSS-importen ble kopiert til utklippstavla.">
              {cssImport}
            </CopyablePreformattedText>
          </div>
        </div>
      )}
    </header>
  );
};

export default PageHeader;
