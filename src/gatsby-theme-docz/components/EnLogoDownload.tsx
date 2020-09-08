import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import EnIcon from './App_ikon.png';

const EnLogoDownload = () => {
  const query = useStaticQuery(graphql`
    query EnLogo {
      allFile(filter: { sourceInstanceName: { eq: "downloads" } }) {
        edges {
          node {
            extension
            dir
            publicURL
          }
        }
      }
    }
  `);
  return (
    <div>
      <img src={EnIcon} width="100%" />
    </div>
  );
};

export default EnLogoDownload;
