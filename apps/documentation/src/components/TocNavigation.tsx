import React from 'react';
import classNames from 'classnames';
import { useDebounce } from '@entur/utils';
import { useCurrentDoc, Entry } from 'docz';
import './TocNavigation.scss';
import { Heading4 } from '@entur/typography';

function useCurrentActiveHeading(headings: Entry['headings']) {
  const [activeHeading, setActiveHeading] = React.useState<string | null>(null);

  const headingElements = headings.map(
    heading => document.getElementById(heading.slug) as HTMLElement,
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
    window.addEventListener('resize', findActiveHeading);
    window.addEventListener('scroll', findActiveHeading);
    findActiveHeading();
    return () => {
      window.removeEventListener('resize', findActiveHeading);
      window.removeEventListener('scroll', findActiveHeading);
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
