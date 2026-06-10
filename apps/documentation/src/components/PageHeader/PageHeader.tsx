import React from 'react';
import { BasePageHeader } from './BasePageHeader';

type Frontmatter = {
  title?: string;
  description?: string;
  parent?: string;
  menu?: string;
  npmPackage?: string;
  tag?: string;
  figmaLink?: string;
};

type Props = {
  frontmatter?: Frontmatter;
};

const PageHeader: React.FC<Props> = ({ frontmatter }) => {
  if (!frontmatter?.title) return null;

  return (
    <BasePageHeader
      title={frontmatter.title}
      category={frontmatter.parent}
      subcategory={frontmatter.menu}
      description={frontmatter.description}
      npmPackage={frontmatter.npmPackage}
      tag={frontmatter.tag}
      figmaLink={frontmatter.figmaLink}
    />
  );
};

export default PageHeader;
