import React from 'react';
import { Heading5, SubLabel } from '@entur/typography';
import { useGetNpmVersion } from './useGetNpmVersion';

import './NpmTag.scss';
import { ActionChip } from '@entur/chip/dist';
import { SourceCodeIcon } from '@entur/icons';

export const NpmTag: React.FC<{ packageName: string }> = ({ packageName }) => {
  const query = useGetNpmVersion();

  const npmInfo = query.allNpmPackage.edges.filter(
    (item: { node: { name: string; version: string } }) =>
      item.node.name === packageName,
  )[0].node;

  return (
    <a
      className="ds-npm-tag"
      href={`https://www.npmjs.com/package/@entur/${npmInfo.name}`}
    >
      <ActionChip>
        <SourceCodeIcon />
        npm v{npmInfo.version}
      </ActionChip>
    </a>
  );
};
