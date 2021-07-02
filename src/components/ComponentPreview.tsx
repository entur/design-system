import React from 'react';
import { MediaCard } from '@entur/layout';
import { GridItem } from '@entur/grid';
import { Link } from 'docz';
import './ComponentPreview.scss';

export const ComponentPreview: React.FC<{
  title: string;
  description: string;
  children: any;
  to: string;
}> = ({ children, title, description, to }) => {
  return (
    <GridItem small={12} medium={6} large={4}>
      <MediaCard
        as={Link}
        to={to}
        title={title}
        description={description}
        className="component-preview"
      >
        <div className="component-preview__image-wrapper">{children}</div>
      </MediaCard>
    </GridItem>
  );
};
