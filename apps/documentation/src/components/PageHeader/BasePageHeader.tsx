import React from 'react';
import { Heading, Text } from '@entur/typography/beta';
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
          <Text variant="label" className="page-header__subcategory-label">
            {subcategory.toUpperCase()}
          </Text>
        </div>
      )}
      <Grid
        templateColumns="auto auto"
        templateRows="auto auto"
        gap="none"
        rowGap="s"
        justify="space-between"
        align="end"
        autoFlow={'column'}
      >
        <Grid.Item
          as={Flex}
          colStart={1}
          colEnd={2}
          rowStart={1}
          rowEnd={2}
          align="baseline"
        >
          <Heading as="h1" variant="title-1" className="page-header__heading">
            {title}
          </Heading>
          {tag && <ArticleTag tag={tag} />}
        </Grid.Item>
        <Grid.Item colStart={1} colEnd={2} rowStart={2} rowEnd={-1}>
          {npmPackage && <NpmTag packageName={npmPackage} tag={tag} />}
        </Grid.Item>
        <Grid.Item colStart={2} colEnd={-1} rowStart={1} rowEnd={-1}>
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
        <Text
          variant="leading"
          spacing={{ top: 'xl', bottom: 'xl' }}
          className="page-header__description"
        >
          {description}
        </Text>
      )}
    </header>
  );
};
