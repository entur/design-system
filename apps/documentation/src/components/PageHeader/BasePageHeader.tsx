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

// Component names like BreadcrumbNavigation may wrap between their words
const withWordBreaks = (title: string) =>
  title.split(/(?<=[a-z])(?=[A-Z])/).map((part, index) => (
    <React.Fragment key={index}>
      {index > 0 && <wbr />}
      {part}
    </React.Fragment>
  ));

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
          <Text variant="overline" spacing={{ bottom: 'xs' }}>
            {subcategory}
          </Text>
        </div>
      )}
      {/* Below s the links go under the title, so a long title gets the full width */}
      <Grid
        templateColumns={{ base: 'minmax(0, 1fr)', s: 'minmax(0, 1fr) auto' }}
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
          gap="m"
        >
          <Heading as="h1" variant="title-1" className="page-header__title">
            {withWordBreaks(title)}
          </Heading>
          {tag && <ArticleTag tag={tag} />}
        </Grid.Item>
        <Grid.Item colStart={1} colEnd={2} rowStart={2} rowEnd={-1}>
          {npmPackage && <NpmTag packageName={npmPackage} tag={tag} />}
        </Grid.Item>
        <Grid.Item
          colStart={{ base: 1, s: 2 }}
          colEnd={{ base: 2, s: 3 }}
          rowStart={{ base: 3, s: 1 }}
          rowEnd={{ base: 4, s: 3 }}
        >
          <Flex direction="column" align={{ base: 'start', s: 'end' }} gap="xs">
            {npmPackage && <PackageChangelog packageName={npmPackage} />}
            <Flex
              direction="row"
              gap="2xs"
              wrap="wrap"
              justify={{ base: 'start', s: 'end' }}
            >
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
        <Text variant="leading" spacing={{ top: 'm', bottom: 'xl' }}>
          {description}
        </Text>
      )}
    </header>
  );
};
