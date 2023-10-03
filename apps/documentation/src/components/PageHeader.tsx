import React from 'react';
import { useCurrentDoc } from 'docz';
import { Heading1, Label, LeadParagraph } from '@entur/typography';
import { useSettings } from './SettingsContext';
import { PackageChangelog } from '../gatsby-theme-docz/components/PackageChangelog';
import './PageHeader.scss';
import { NpmTag } from '../gatsby-theme-docz/components/NpmTag';
import { CopyableText } from '@entur/alert';

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
  const cssImport = `@import '@entur/${npmPackage}/dist/styles.css';`;
  return (
    <header>
      {categoryToShow && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Label
            as="div"
            style={{ letterSpacing: '1px', marginBottom: '0.5rem' }}
          >
            {categoryToShow.toUpperCase()}
          </Label>
          {npmPackage && userType === 'developer' && (
            <span style={{ float: 'right' }}>
              <PackageChangelog packageName={npmPackage}></PackageChangelog>
            </span>
          )}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Heading1 margin="none" style={{ marginRight: '1rem' }}>
          {titleToShow}
        </Heading1>
        {npmPackage && userType === 'developer' && (
          <NpmTag packageName={npmPackage}></NpmTag>
        )}
      </div>
      {leadText && <LeadParagraph>{leadText}</LeadParagraph>}
      {npmPackage && userType === 'developer' && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}
          >
            <CopyableText successMessage="Innstalleringstekst ble kopiert til utklippstavla.">
              {installText}
            </CopyableText>
            <CopyableText successMessage="CSS-importen ble kopiert til utklippstavla.">
              {cssImport}
            </CopyableText>
          </div>
        </div>
      )}
    </header>
  );
};
export default PageHeader;
