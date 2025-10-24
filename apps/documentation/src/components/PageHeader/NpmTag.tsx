import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { ActionChip } from '@entur/chip';
import { SourceCodeIcon } from '@entur/icons';

import './NpmTag.scss';

export const NpmTag: React.FC<{ packageName: string }> = ({ packageName }) => {
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
    item =>
      item.name === packageName ||
      item.name === packageName.split('@entur/')?.[1],
  );

  return (
    <a
      className="ds-npm-tag"
      href={`https://www.npmjs.com/package/@entur/${currentPackage?.name}`}
    >
      <ActionChip>
        <SourceCodeIcon />
        npm v{currentPackage?.version}
      </ActionChip>
    </a>
  );
};
