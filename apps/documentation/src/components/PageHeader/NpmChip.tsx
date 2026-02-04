import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { ActionChip } from '@entur/chip';
import { SourceCodeIcon } from '@entur/icons';

import './NpmTag.scss';

export const NpmChip: React.FC<{ packageName: string }> = ({ packageName }) => {
  const normalizedPackageName = packageName.replace(/\/beta$/, '');
  const packageKey = normalizedPackageName.split('@entur/')?.[1];
  const packageVersions = useStaticQuery(graphql`
    query {
      allNpmPackageVersion {
        nodes {
          version
          name
        }
      }
    }
  `)?.allNpmPackageVersion?.nodes as Array<{ name: string; version: string }>;

  const currentPackage = packageVersions.find(
    item => item.name === normalizedPackageName || item.name === packageKey,
  );

  return (
    <a
      className="ds-npm-tag"
      href={`https://www.npmjs.com/package/@entur/${currentPackage?.name}`}
    >
      <ActionChip>
        <SourceCodeIcon aria-hidden="true" />
        npm v{currentPackage?.version}
      </ActionChip>
    </a>
  );
};
