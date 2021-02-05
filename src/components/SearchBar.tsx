import React from 'react';
import { TextField } from '@entur/form';
import { SearchIcon } from '@entur/icons';
import classNames from 'classnames';
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

export const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  onSearchTextChange,
  className,
}) => {
  let inputRef = React.useRef<HTMLInputElement>(null);
  let previousFocusRef = React.useRef<HTMLElement>();
  // This little trick lets the user tap '/' to focus the search field
  React.useEffect(() => {
    function handleKeyUp(e: KeyboardEvent) {
      const hasFocus = inputRef.current === document.activeElement;
      switch (e.key) {
        case '/':
          if (
            !hasFocus &&
            !document.activeElement?.className.includes('code-editor')
          ) {
            previousFocusRef.current = document.activeElement as HTMLElement;
            e.stopPropagation();
            inputRef.current!.focus(); // inputRef will always be set
          }
          break;
        case 'Escape':
          if (hasFocus && previousFocusRef.current) {
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
        prepend={<SearchIcon />}
        label="Søk..."
        value={searchText}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onSearchTextChange(e.target.value);
          console.log('change', e);
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
