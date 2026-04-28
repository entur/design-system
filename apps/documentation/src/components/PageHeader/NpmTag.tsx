import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { Tag } from '@entur/layout';
import { Flex } from '@entur/layout/beta';
import { sanitizeEnturPackageName } from 'src/utils/utils';

import './NpmTag.scss';

export const NpmTag: React.FC<{ packageName: string; tag?: string }> = ({
  packageName,
  tag,
}) => {
  const packageKey = sanitizeEnturPackageName(packageName);
  const fullPackageName = `@entur/${packageKey}`;
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
    item => item.name === fullPackageName || item.name === packageKey,
  );

  return (
    <Flex gap="s">
      <Tag>
        {fullPackageName}
        {tag === 'beta' ? '/beta' : ''}
      </Tag>
      <Tag>v{currentPackage?.version}</Tag>
    </Flex>
  );
};
