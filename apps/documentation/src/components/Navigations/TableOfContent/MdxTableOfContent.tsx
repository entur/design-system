import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { useLocation } from '@reach/router';
import { removeTrailingSlash } from '../SideNavigation/utils';
import TableOfContent, { TocHeading } from './TableOfContent';

interface MdxHeading {
  url: string;
  title: string;
  items?: MdxHeading[];
}

interface TableOfContentQuery {
  allMdx: {
    nodes: {
      frontmatter: {
        route: string;
        removeToc: boolean;
      };
      tableOfContents: {
        items?: MdxHeading[];
      };
    }[];
  };
}

const flattenHeadings = (
  items: MdxHeading[] = [],
  headingLevel = 2,
): TocHeading[] => {
  return items.reduce((acc: TocHeading[], item) => {
    const id = item.url?.replace('#', '');
    if (id && item.title) {
      acc.push({ id, title: item.title, depth: headingLevel });
    }
    if (item.items) {
      acc.push(...flattenHeadings(item.items, headingLevel + 1));
    }
    return acc;
  }, []);
};

const MdxTableOfContent = () => {
  const { pathname } = useLocation();

  const data: TableOfContentQuery = useStaticQuery(graphql`
    query TocNavigationQuery {
      allMdx {
        nodes {
          frontmatter {
            route
            removeToc
          }
          tableOfContents
        }
      }
    }
  `);

  const headings = useMemo(() => {
    if (!data?.allMdx?.nodes) return [];
    const currentDoc = data.allMdx.nodes.find(
      node =>
        removeTrailingSlash(node.frontmatter.route) ===
        removeTrailingSlash(pathname),
    );
    if (!currentDoc || currentDoc.frontmatter.removeToc) return [];
    return flattenHeadings(currentDoc.tableOfContents?.items);
  }, [data, pathname]);

  return <TableOfContent headings={headings} />;
};

export default MdxTableOfContent;
