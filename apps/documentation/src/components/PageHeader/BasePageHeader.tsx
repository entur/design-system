import React from 'react';
import { Heading1, Label, LeadParagraph } from '@entur/typography';
import { CopyableText } from '@entur/alert';
import { useSettings } from '@providers/SettingsContext';
import { PackageChangelog } from './PackageChangelog';
import { NpmTag } from './NpmTag';
import './PageHeader.scss';
import { ComponentIcon } from '@entur/icons';
import { ActionChip } from '@entur/chip';
import { Heading2, Paragraph } from '@entur/typography';

export type BasePageHeaderProps = {
  title: string;
  category?: string;
  subcategory?: string;
  description?: string;
  npmPackage?: string;
<<<<<<< HEAD
  isCategoryLandingPage?: boolean;
=======
  figmaLink?: string;
>>>>>>> b3601253 (refactor(website): new structure in componentsites with tabs)
};

export const BasePageHeader: React.FC<BasePageHeaderProps> = ({
  title,
  category,
  subcategory,
  description,
  npmPackage,
<<<<<<< HEAD
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
=======
  figmaLink,
}) => {
  const { packageManager, userType } = useSettings();

  return (
    <header className="page-header">
      {subcategory && (
        <div className="page-header__subcategory-wrapper">
          <Label as="div" className="page-header__subcategory-label">
            {subcategory.toUpperCase()}
>>>>>>> b3601253 (refactor(website): new structure in componentsites with tabs)
          </Label>
        </div>
      )}
      <div className="page-header__title-row">
        <Heading1 margin="none" className="page-header__heading">
          {title}
        </Heading1>
        <div className="page-header__actions">
          {npmPackage && userType === 'developer' && (
            <NpmTag packageName={npmPackage} />
          )}
          {npmPackage && userType === 'developer' && (
            <PackageChangelog packageName={npmPackage} />
          )}
          {figmaLink && (
            <ActionChip>
              <ComponentIcon />
              Figma
            </ActionChip>
          )}
        </div>
      </div>
      {description && (
        <LeadParagraph className="page-header__description">
          {description}
        </LeadParagraph>
      )}
    </header>
  );
};
