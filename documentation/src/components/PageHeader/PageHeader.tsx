import React from 'react';
import { useLocation } from '@reach/router';
import { useStaticQuery, graphql } from 'gatsby';
import { Heading1, Label, LeadParagraph } from '@entur/typography';
import { useSettings } from '../../providers/SettingsContext';
import { PackageChangelog } from './PackageChangelog';
import './PageHeader.scss';
import { NpmTag } from './NpmTag';
import { CopyableText } from '@entur/alert';

type Props = {
  category?: string;
  forceNoLeadText?: boolean;
  title?: string;
  children?: React.ReactNode;
};

const PageHeader: React.FC<Props> = ({
  title,
  children,
  category,
  forceNoLeadText,
}) => {
  const location = useLocation();
  const data = useStaticQuery(graphql`
    query {
      allMdx {
        nodes {
          frontmatter {
            title
            npmPackage
            route
            description
            parent
          }
        }
      }
    }
  `);

  const currentDoc = data.allMdx.nodes.find(node =>
    new RegExp(`^${node.frontmatter.route}$`).test(location.pathname),
  );

  const npmPackage = currentDoc?.frontmatter?.npmPackage || '';

  const categoryToShow = category || currentDoc?.frontmatter.parent || '';
  const titleToShow = title || currentDoc?.frontmatter?.title || '';
  const { packageManager, userType } = useSettings();
  const leadText = forceNoLeadText
    ? null
    : children || currentDoc?.frontmatter?.description;
  const installText =
    packageManager === 'yarn'
      ? `yarn add @entur/${npmPackage}`
      : `npm install @entur/${npmPackage}`;
  const cssImport = `@import '@entur/${npmPackage}/dist/styles.css';`;

  return (
    <header>
      {categoryToShow && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Label
            as="div"
            style={{ letterSpacing: '1px', marginBottom: '0.5rem' }}
          >
            {categoryToShow.toUpperCase()}
          </Label>
          {npmPackage && userType === 'developer' && (
            <span style={{ float: 'right' }}>
              <PackageChangelog packageName={npmPackage} />
            </span>
          )}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Heading1 margin="none" style={{ marginRight: '1rem' }}>
          {titleToShow}
        </Heading1>
        {npmPackage && userType === 'developer' && (
          <NpmTag packageName={npmPackage} />
        )}
      </div>
      {leadText && <LeadParagraph>{leadText}</LeadParagraph>}
      {npmPackage && userType === 'developer' && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}
          >
            {/*             
            <CopyableText successMessage="Innstalleringstekst ble kopiert til utklippstavla.">
              {installText}
            </CopyableText>
            <CopyableText successMessage="CSS-importen ble kopiert til utklippstavla.">
              {cssImport}
            </CopyableText> */}
          </div>
        </div>
      )}
    </header>
  );
};

export default PageHeader;
