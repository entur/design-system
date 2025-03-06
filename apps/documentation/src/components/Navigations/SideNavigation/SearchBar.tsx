import React from 'react';
import classNames from 'classnames';
import { useLocation } from '@reach/router';

import { TextField } from '@entur/form';
import { SearchIcon } from '@entur/icons';
import { Badge } from '@entur/layout';

import './SearchBar.scss';

const LazyEasterEgg = React.lazy(() => import('react-confetti'));

type SearchBarProps = {
  /** The query text shown in the search field */
  searchText: string;
  /** Change handler, passed to the DOM input element */
  onSearchTextChange: (text: string) => void;
  /** Ekstra klassenavn */
  className?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  onSearchTextChange,
  className,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const previousFocusRef = React.useRef<HTMLElement>();
  const location = useLocation();

  // Reset searchText when the URL changes
  React.useEffect(() => {
    onSearchTextChange('');
  }, [location.pathname, onSearchTextChange]);

  // This little trick lets the user tap '/' to focus the search field
  React.useEffect(() => {
    function handleKeyUp(e: KeyboardEvent) {
      const searchHasFocus = inputRef.current === document.activeElement;
      const playgroundHasFocus =
        document.activeElement?.parentElement?.className.includes(
          'playground__expandable__editor',
        );
      switch (e.key) {
        case '/':
          if (!searchHasFocus && !playgroundHasFocus) {
            previousFocusRef.current = document.activeElement as HTMLElement;
            e.stopPropagation();
            inputRef.current && inputRef.current.focus(); // inputRef will always be set
          }
          break;
        case 'Escape':
          if (searchHasFocus && previousFocusRef.current) {
            previousFocusRef.current.focus();
            onSearchTextChange('');
          }
          break;
      }
    }
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  });

  const enableEasterEgg = searchText === '🎉';

  return (
    <div className={classNames('searchbar-wrapper', className)}>
      <TextField
        key={location.pathname}
        prepend={<SearchIcon aria-hidden="true" />}
        append={
          <Badge
            as="kbd"
            variant="neutral"
            type="status"
            style={{
              width: '2ch',
              minWidth: 'unset',
              paddingInline: '0.25rem',
            }}
          >
            /
          </Badge>
        }
        label="Søk i meny"
        value={searchText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onSearchTextChange(e.target.value);
        }}
        width="fluid"
        ref={inputRef}
      />
      {enableEasterEgg && (
        <React.Suspense fallback="">
          <LazyEasterEgg />
        </React.Suspense>
      )}
    </div>
  );
};

export default SearchBar;
