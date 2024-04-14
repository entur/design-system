import React from 'react';
import { Heading5, SubLabel } from '@entur/typography';
import { useGetNpmVersion } from './useGetNpmVersion';

import './NpmTag.scss';

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
      <Heading5 as="span">npm</Heading5>
      <SubLabel>v{npmInfo.version}</SubLabel>
    </a>
  );
};
