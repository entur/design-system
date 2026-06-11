import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from '@reach/router';
import classNames from 'classnames';
import { Heading4 } from '@entur/typography';
import { ExpandablePanel } from '@entur/expand';
import {
  getNavbarHeightPx,
  handleHashLinkClick,
} from '../../../utils/scrollUtils';

import './TableOfContent.scss';

export interface TocHeading {
  id: string;
  title: string;
  depth: number;
}

interface TableOfContentProps {
  headings: TocHeading[];
}

function useActiveHeading(headings: TocHeading[]) {
  const [activeId, setActiveId] = useState<string | null>(
    headings[0]?.id ?? null,
  );
  const rafId = useRef(0);
  const clickedId = useRef<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const update = () => {
      if (clickedId.current) return;
      const offsetPx = getNavbarHeightPx() + 2;
      let current = headings[0]?.id ?? null;
      for (const heading of headings) {
        const el = document.getElementById(heading.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offsetPx) {
          current = heading.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };

    const onScrollEnd = () => {
      clickedId.current = null;
      update();
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scrollend', onScrollEnd, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scrollend', onScrollEnd);
      cancelAnimationFrame(rafId.current);
    };
  }, [headings]);

  const { pathname } = useLocation();
  useEffect(() => {
    if (headings.length > 0) {
      setActiveId(headings[0].id);
    }
  }, [pathname, headings]);

  const setClickedHeading = (id: string) => {
    clickedId.current = id;
    setActiveId(id);
  };

  return { activeId, setClickedHeading };
}

const TocList: React.FC<{
  headings: TocHeading[];
  activeId: string | null;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
  animated?: boolean;
}> = ({ headings, activeId, onLinkClick, animated = false }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animated || !listRef.current || !indicatorRef.current || !activeId)
      return;
    const list = listRef.current;
    const activeLink = list.querySelector(
      `a[href="#${CSS.escape(activeId)}"]`,
    ) as HTMLElement | null;
    if (!activeLink) return;
    const listRect = list.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    indicatorRef.current.style.transform = `translateY(${
      linkRect.top - listRect.top
    }px)`;
    indicatorRef.current.style.height = `${linkRect.height}px`;
  }, [activeId, animated]);

  return (
    <div className="table-of-content-wrapper" ref={listRef}>
      {animated && (
        <div ref={indicatorRef} className="table-of-content__indicator" />
      )}
      <ul className="table-of-content">
        {headings.map(heading => (
          <li
            key={heading.id}
            className={classNames(
              'table-of-content__item',
              `table-of-content__item--depth-${heading.depth}`,
            )}
          >
            <a
              className={classNames('table-of-content__link', {
                'table-of-content__link--active': activeId === heading.id,
              })}
              href={`#${heading.id}`}
              onClick={e => onLinkClick(e, heading.id)}
            >
              <span>{heading.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const useFilteredHeadings = (headings: TocHeading[]) =>
  useMemo(() => headings.filter(h => h.depth >= 2 && h.depth <= 4), [headings]);

const TableOfContentSidebar: React.FC<TableOfContentProps> = ({ headings }) => {
  const filteredHeadings = useFilteredHeadings(headings);
  const { activeId, setClickedHeading } = useActiveHeading(filteredHeadings);

  if (filteredHeadings.length < 2) return null;

  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setClickedHeading(id);
    handleHashLinkClick(e);
  };

  return (
    <nav className="table-of-content-sidebar" aria-label="Innhold">
      <Heading4 as="h2" style={{ margin: 0, marginBlockEnd: '1rem' }}>
        Innhold
      </Heading4>
      <TocList
        headings={filteredHeadings}
        activeId={activeId}
        onLinkClick={onLinkClick}
        animated
      />
    </nav>
  );
};

const TableOfContentInline: React.FC<TableOfContentProps> = ({ headings }) => {
  const filteredHeadings = useFilteredHeadings(headings);
  const { activeId, setClickedHeading } = useActiveHeading(filteredHeadings);

  if (filteredHeadings.length < 2) return null;

  const onLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setClickedHeading(id);
    handleHashLinkClick(e);
  };

  return (
    <nav className="table-of-content-inline" aria-label="Innhold">
      <ExpandablePanel title="Innhold">
        <TocList
          headings={filteredHeadings}
          activeId={activeId}
          onLinkClick={onLinkClick}
        />
      </ExpandablePanel>
    </nav>
  );
};

export { TableOfContentSidebar, TableOfContentInline };
export default TableOfContentInline;
