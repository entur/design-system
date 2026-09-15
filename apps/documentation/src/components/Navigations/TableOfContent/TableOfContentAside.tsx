import React from 'react';
import { TableOfContent, filterTocHeadings } from './TableOfContent';
import { useTocHeadings } from './TocContext';

import './TableOfContent.scss';

// The page being shown pushes its headings into TocContext, so nothing is
// queried here.
const TableOfContentAside: React.FC = () => {
  const { headings } = useTocHeadings();

  if (!headings || filterTocHeadings(headings).length < 2) return null;

  return (
    <aside className="toc-aside">
      <TableOfContent headings={headings} variant="sidebar" />
    </aside>
  );
};

export default TableOfContentAside;
