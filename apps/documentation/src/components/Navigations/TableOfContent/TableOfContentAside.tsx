import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { useLocation } from '@reach/router';
import { removeTrailingSlash } from '../SideNavigation/utils';
import { getSanitizedPath } from '../../../utils/getSanitizedPath';
import { TableOfContentSidebar } from './TableOfContent';
import type { TocHeading } from './TableOfContent';
import { extractHeadingsFromPortableText } from './SanityTableOfContent';
import { useTocHeadings } from './TocContext';

import './TableOfContent.scss';

interface MdxHeading {
  url: string;
  title: string;
  items?: MdxHeading[];
}

const flattenMdxHeadings = (
  items: MdxHeading[] = [],
  headingLevel = 2,
): TocHeading[] =>
  items.reduce((acc: TocHeading[], item) => {
    const id = item.url?.replace('#', '');
    if (id && item.title) {
      acc.push({ id, title: item.title, depth: headingLevel });
    }
    if (item.items) {
      acc.push(...flattenMdxHeadings(item.items, headingLevel + 1));
    }
    return acc;
  }, []);

const TableOfContentAside: React.FC = () => {
  const { pathname } = useLocation();
  const { headings: contextHeadings } = useTocHeadings();

  const data = useStaticQuery(graphql`
    query TableOfContentAsideQuery {
      allMdx {
        nodes {
          frontmatter {
            route
          }
          tableOfContents
        }
      }
      allSanityPage {
        nodes {
          category
          subcategory
          title
          isCategoryLandingPage
          tag
          content {
            _rawItems(resolveReferences: { maxDepth: 5 })
          }
        }
      }
      allSanityComponentDoc {
        nodes {
          category
          subcategory
          title
          tag
          tabs {
            _rawContent(resolveReferences: { maxDepth: 5 })
          }
          beskrivelse {
            _rawItems(resolveReferences: { maxDepth: 5 })
          }
          utvikling {
            _rawItems(resolveReferences: { maxDepth: 5 })
          }
        }
      }
    }
  `);

  const headings = useMemo(() => {
    const normalizedPath = removeTrailingSlash(pathname);

    const mdxMatch = data.allMdx.nodes.find(
      (node: any) =>
        removeTrailingSlash(node.frontmatter.route) === normalizedPath,
    );
    if (mdxMatch) {
      return flattenMdxHeadings(mdxMatch.tableOfContents?.items);
    }

    const sanityPageMatch = data.allSanityPage.nodes.find((node: any) => {
      const path = getSanitizedPath({
        title: node.title,
        category: node.category,
        subcategory: node.subcategory,
        isCategoryLandingPage: node.isCategoryLandingPage,
        tag: node.tag,
      });
      return removeTrailingSlash(path) === normalizedPath;
    });
    if (sanityPageMatch?.content) {
      return extractHeadingsFromPortableText(sanityPageMatch.content);
    }

    const componentDocMatch = data.allSanityComponentDoc.nodes.find(
      (node: any) => {
        const path = getSanitizedPath({
          title: node.title,
          category: node.category,
          subcategory: node.subcategory,
          tag: node.tag,
        });
        return removeTrailingSlash(path) === normalizedPath;
      },
    );
    if (componentDocMatch) {
      const tabs =
        componentDocMatch.tabs && componentDocMatch.tabs.length > 0
          ? componentDocMatch.tabs
          : [
              { _rawContent: componentDocMatch.beskrivelse },
              { _rawContent: componentDocMatch.utvikling },
            ];
      const firstTab = tabs[0];
      if (firstTab?._rawContent) {
        return extractHeadingsFromPortableText(firstTab._rawContent);
      }
    }

    return [];
  }, [data, pathname]);

  const resolvedHeadings = contextHeadings ?? headings;

  return (
    <aside className="toc-aside" aria-label="Innhold">
      <TableOfContentSidebar headings={resolvedHeadings} />
    </aside>
  );
};

export default TableOfContentAside;
