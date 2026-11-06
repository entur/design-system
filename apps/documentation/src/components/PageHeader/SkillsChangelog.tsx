import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import { ChangelogButton } from './PackageChangelog';

/** Changelogen for skills, bygget fra git-historikken i gatsby-node. */
export const SkillsChangelog = () => {
  const { file } = useStaticQuery(graphql`
    query SkillsChangelog {
      file(sourceInstanceName: { eq: "skills-changelog" }) {
        publicURL
      }
    }
  `);

  if (!file) return null;

  return <ChangelogButton title="Skills" url={file.publicURL} />;
};
