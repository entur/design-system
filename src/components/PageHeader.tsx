import React from 'react';
import { useCurrentDoc } from 'docz';
import { Heading1, Label, LeadParagraph } from '@entur/typography';
import { CopyablePreformattedText } from '~/components/CopyablePreformattedText';
import { useSettings } from './SettingsContext';
import { PackageChangelog } from '../gatsby-theme-docz/components/PackageChangelog';
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
        <Label
          as="div"
          style={{ letterSpacing: '1px', marginBottom: '0.5rem' }}
        >
          {categoryToShow.toUpperCase()}
        </Label>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Heading1 margin="none">{titleToShow}</Heading1>
        {npmPackage && userType === 'developer' && (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <img
              style={{ marginRight: '0.5rem' }}
              alt="npm"
              src={`https://img.shields.io/npm/v/@entur/${npmPackage}?color=181c56&style=flat-square`}
            ></img>
            <PackageChangelog packageName={npmPackage}></PackageChangelog>
          </span>
        )}
      </div>
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
