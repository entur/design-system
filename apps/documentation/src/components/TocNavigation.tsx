import React from 'react';
import classNames from 'classnames';
import { useCurrentDoc, Entry } from 'docz';

import { useDebounce } from '@entur/utils';
import { Heading4 } from '@entur/typography';

import './TocNavigation.scss';

function useCurrentActiveHeading(headings: Entry['headings']) {
  const [activeHeading, setActiveHeading] = React.useState<string | null>(null);
  const [headingElements, setHeadingElements] = React.useState<HTMLElement[]>(
    [],
  );

  const findActiveHeading = useDebounce(() => {
    for (const i in headingElements) {
      if (!headingElements[i]) {
        continue;
      }
      const thisTop = headingElements[i].getBoundingClientRect().top;
      const nextTop =
        headingElements[Number(i) + 1]?.getBoundingClientRect().top;

      if (thisTop + nextTop >= 0 || thisTop >= 0) {
        setActiveHeading(headingElements[i].id);
        break;
      }
    }
  }, 16);

  React.useEffect(() => {
    setHeadingElements(
      headings.map(
        heading => document.getElementById(heading.slug) as HTMLElement,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const articleSection = document.getElementsByClassName('page')?.[0];
    if (articleSection === null) return;

    articleSection.addEventListener('resize', findActiveHeading);
    articleSection.addEventListener('scroll', findActiveHeading);
    findActiveHeading();
    return () => {
      articleSection.removeEventListener('resize', findActiveHeading);
      articleSection.removeEventListener('scroll', findActiveHeading);
    };
  }, [findActiveHeading]);

  return activeHeading;
}

export const TocNavigation: React.FC = () => {
  const currentDoc = useCurrentDoc() as Entry;
  const headings = currentDoc
    ? currentDoc.headings.filter(
        heading => heading.depth > 1 && heading.depth < 4,
      )
    : [];
  const activeHeading = useCurrentActiveHeading(headings);
  if (currentDoc.removeToc) {
    return null;
  }
  if (headings.length < 2) {
    return null;
  }
  return (
    <nav className="table-of-content-container">
      <Heading4 style={{ margin: 0 }}>Innhold</Heading4>
      <ul className="table-of-content">
        {headings.map(heading => (
          <li
            key={heading.slug}
            className={classNames(
              'table-of-content__item',
              `table-of-content__item--depth-${heading.depth}`,
            )}
          >
            <a
              className={classNames('table-of-content__link', {
                'table-of-content__link--active':
                  activeHeading === heading.slug,
              })}
              href={`#${heading.slug}`}
            >
              {heading.value}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
