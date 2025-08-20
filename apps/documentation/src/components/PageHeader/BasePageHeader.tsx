import React from 'react';
import { Heading1, Label, LeadParagraph } from '@entur/typography';
import { CopyableText } from '@entur/alert';
import { useSettings } from '@providers/SettingsContext';
import { PackageChangelog } from './PackageChangelog';
import { NpmTag } from './NpmTag';
import './PageHeader.scss';

type Props = {
  title: string;
  category?: string;
  subcategory?: string;
  description?: string;
  npmPackage?: string;
  isCategoryLandingPage?: boolean;
};

export const BasePageHeader: React.FC<Props> = ({
  title,
  category,
  subcategory,
  description,
  npmPackage,
  isCategoryLandingPage,
}) => {
  const { packageManager, userType } = useSettings();

  const installText =
    packageManager === 'yarn'
      ? `yarn add @entur/${npmPackage}`
      : `npm install @entur/${npmPackage}`;
  const cssImport = `@import '@entur/${npmPackage}/dist/styles.css';`;

  // For category landing pages, show category instead of subcategory
  const labelText = isCategoryLandingPage ? category : subcategory;

  return (
    <header>
      {labelText && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Label
            as="div"
            style={{ letterSpacing: '1px', marginBottom: '0.5rem' }}
          >
            {labelText.toUpperCase()}
          </Label>
          {npmPackage && userType === 'developer' && (
            <span style={{ float: 'right' }}>
              <PackageChangelog packageName={npmPackage} />
            </span>
          )}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Heading1 margin="none" style={{ marginRight: '1rem' }}>
          {title}
        </Heading1>
        {npmPackage && userType === 'developer' && (
          <NpmTag packageName={npmPackage} />
        )}
      </div>
      {description && <LeadParagraph>{description}</LeadParagraph>}
      {npmPackage && userType === 'developer' && (
        <div className="page-header__import-wrapper">
          <CopyableText
            successMessage="Innstalleringstekst ble kopiert til utklippstavla."
            className="page-header__import-wrapper__copy-button"
          >
            {installText}
          </CopyableText>
          <CopyableText
            successMessage="CSS-importen ble kopiert til utklippstavla."
            className="page-header__import-wrapper__copy-button"
          >
            {cssImport}
          </CopyableText>
        </div>
      )}
    </header>
  );
};
