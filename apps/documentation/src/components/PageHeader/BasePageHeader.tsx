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
  isCategoryLandingPage?: boolean;
  figmaLink?: string;
};

export const BasePageHeader: React.FC<BasePageHeaderProps> = ({
  title,
  category,
  subcategory,
  description,
  npmPackage,
  figmaLink,
}) => {
  const { packageManager, userType } = useSettings();
  console.log('userType:', userType);
  console.log('npmPackage:', npmPackage);
  return (
    <header className="page-header">
      {subcategory && (
        <div className="page-header__subcategory-wrapper">
          <Label as="div" className="page-header__subcategory-label">
            {subcategory.toUpperCase()}
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
