import React from 'react';
import { Heading1, Label, LeadParagraph } from '@entur/typography';
import { PackageChangelog } from './PackageChangelog';
import { ComponentIcon, GithubIcon, SourceCodeIcon } from '@entur/icons';
import { ActionChip } from '@entur/chip';
import { Flex, Grid } from '@entur/layout/beta';
import { isBetaTag, sanitizeEnturPackageName } from 'src/utils/utils';
import { ArticleTag } from '../Common/ArticleTag';
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
  tag?: string;
};

export const BasePageHeader: React.FC<BasePageHeaderProps> = ({
  title,
  subcategory,
  description,
  npmPackage,
  figmaLink,
  tag,
}) => {
  return (
    <header className="page-header">
      {subcategory && (
        <div className="page-header__subcategory-wrapper">
          <Label as="div" className="page-header__subcategory-label">
            {subcategory.toUpperCase()}
          </Label>
        </div>
      )}
      <Grid
        templateColumns="auto auto"
        templateRows="auto auto"
        gap="none"
        rowGap="s"
        justify="space-between"
        align="end"
      >
        <Grid.Item as={Flex} colSpan="1 / 2" rowSpan="1 / 2" align="baseline">
          <Heading1 margin="none" className="page-header__heading">
            {title}
          </Heading1>
          {tag && <ArticleTag tag={tag} />}
        </Grid.Item>
        <Grid.Item colSpan="1 / 2" rowSpan="2 / -1">
          {npmPackage && <NpmTag packageName={npmPackage} tag={tag} />}
        </Grid.Item>
        <Grid.Item colSpan="2 / -1" rowSpan="1 / -1">
          <Flex direction="column" align="end" gap="xs">
            {npmPackage && <PackageChangelog packageName={npmPackage} />}
            <Flex direction="row" gap="2xs" wrap="wrap" justify="end">
              {npmPackage && (
                <a
                  className="ds-npm-tag"
                  href={`https://www.npmjs.com/package/@entur/${sanitizeEnturPackageName(
                    npmPackage,
                  )}`}
                >
                  <ActionChip>
                    Npm <SourceCodeIcon aria-hidden="true" />
                  </ActionChip>
                </a>
              )}
              {figmaLink && (
                <a className="ds-npm-tag" href={figmaLink}>
                  <ActionChip>
                    Figma
                    <ComponentIcon aria-hidden="true" />
                  </ActionChip>
                </a>
              )}
              {npmPackage && (
                <a
                  className="ds-npm-tag"
                  href={`https://github.com/entur/design-system/tree/main/packages/${sanitizeEnturPackageName(
                    npmPackage,
                  )}${isBetaTag(tag) ? '/src/beta' : ''}`}
                >
                  <ActionChip>
                    Github <GithubIcon aria-hidden="true" />
                  </ActionChip>
                </a>
              )}
            </Flex>
          </Flex>
        </Grid.Item>
      </Grid>
      {description && (
        <LeadParagraph className="page-header__description">
          {description}
        </LeadParagraph>
      )}
    </header>
  );
};
