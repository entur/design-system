import React from 'react';
import classNames from 'classnames';
import debounce from 'src/utils/debounce';
import { useCurrentDoc, Entry } from 'docz';
import './TocNavigation.scss';

function useCurrentActiveHeading(headings: Entry['headings']) {
  let headingElements: HTMLElement[] = [];
  const [activeHeading, setActiveHeading] = React.useState<string | null>(null);

  const findActiveHeading = debounce(() => {
    for (let nextElement of headingElements) {
      const nextTop = nextElement.getBoundingClientRect().top;
      if (nextTop >= 0) {
        setActiveHeading(nextElement.id);
        break;
      }
    }
  }, 16);

  React.useEffect(() => {
    headingElements = headings.map(
      heading => document.getElementById(heading.slug) as HTMLElement,
    );
    window.addEventListener('resize', findActiveHeading);
    window.addEventListener('scroll', findActiveHeading);
    findActiveHeading();
    return () => {
      window.removeEventListener('resize', findActiveHeading);
      window.removeEventListener('scroll', findActiveHeading);
    };
  }, []);

  return activeHeading;
}

export const TocNavigation: React.FC = () => {
  const currentDoc = useCurrentDoc() as Entry;
  const headings = currentDoc
    ? currentDoc.headings.filter(heading => heading.depth > 1)
    : [];
  const activeHeading = useCurrentActiveHeading(headings);
  if (headings.length < 2) {
    return null;
  }
  return (
    <nav className="table-of-content-container">
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
