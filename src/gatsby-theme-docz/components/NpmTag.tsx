import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import './NpmTag.scss';
import { SmallText } from '@entur/typography';

export const NpmTag: React.FC<{ packageName: string }> = ({ packageName }) => {
  const query = useStaticQuery(graphql`
    query NpmVersion {
      allNpmPackage {
        edges {
          node {
            version
            name
          }
        }
      }
    }
  `);

  const npmV = query.allNpmPackage.edges.filter(
    item => item.node.name === packageName,
  );

  return (
    <div className="ds-npm-tag">
      <SmallText className="ds-npm-tag__npm">npm</SmallText>
      <SmallText className="ds-npm-tag__version">
        v{npmV[0].node.version}
      </SmallText>
    </div>
  );
};
