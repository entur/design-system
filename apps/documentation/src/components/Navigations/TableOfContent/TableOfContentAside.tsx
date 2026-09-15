import React from 'react';
import { TableOfContentSidebar, hasEnoughHeadings } from './TableOfContent';
import { useTocHeadings } from './TocContext';

import './TableOfContent.scss';

// Headings come from whichever page is mounted — the templates and
// MdxTableOfContent push them into TocContext — so this never queries content
// of its own.
const TableOfContentAside: React.FC = () => {
  const { headings } = useTocHeadings();

  if (!headings || !hasEnoughHeadings(headings)) return null;

  return (
    <aside className="toc-aside">
      <TableOfContentSidebar headings={headings} />
    </aside>
  );
};

export default TableOfContentAside;
