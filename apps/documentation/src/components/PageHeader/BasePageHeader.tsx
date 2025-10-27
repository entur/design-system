import React from 'react';
import { Heading, Text } from '@entur/typography/beta';
import { CopyableText } from '@entur/alert';
import { useSettings } from '@providers/SettingsContext';
import { PackageChangelog } from './PackageChangelog';
import { NpmTag } from './NpmTag';
import './PageHeader.scss';

export type BasePageHeaderProps = {
  title: string;
  category?: string;
  subcategory?: string;
  description?: string;
  npmPackage?: string;
  isCategoryLandingPage?: boolean;
  figmaLink?: string;
};

export const BasePageHeader: React.FC<BasePageHeaderProps> = ({
  title,
  category,
  description,
  npmPackage,
}) => {
  const { packageManager, userType } = useSettings();

  const categoryToShow = category || '';
  const installText =
    packageManager === 'yarn'
      ? `yarn add @entur/${npmPackage}`
      : `npm install @entur/${npmPackage}`;
  const cssImport = `@import '@entur/${npmPackage}/dist/styles.css';`;

  return (
    <header>
      {categoryToShow && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text
            variant="label"
            as="div"
            style={{ letterSpacing: '1px', marginBottom: '0.5rem' }}
          >
            {categoryToShow.toUpperCase()}
          </Text>
          {npmPackage && userType === 'developer' && (
            <span style={{ float: 'right' }}>
              <PackageChangelog packageName={npmPackage} />
            </span>
          )}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Heading as="h1" variant="title-1" style={{ marginRight: '1rem' }}>
          {title}
        </Heading>
        {npmPackage && userType === 'developer' && (
          <NpmTag packageName={npmPackage} />
        )}
      </div>
      {description && <Text variant="leading">{description}</Text>}
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
