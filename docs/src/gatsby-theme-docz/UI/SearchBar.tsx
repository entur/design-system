import React from 'react';
import { TextField } from '@entur/form';
import { MenuItem, Entry } from 'docz';
import matchSorter from 'match-sorter';
import { Contrast } from '@entur/layout';
import { SearchIcon } from '@entur/icons';
import './SearchBar.scss';

type SearchBarProps = {
  menuItems: MenuItem[];
  propagateFilteredSearch: Function;
};

export function SearchBar(props: SearchBarProps) {
  const [filter, setFilter] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  let inputRef = React.createRef<HTMLInputElement>();

  const filteredMenuItems = React.useMemo(() => {
    if (filter === '') {
      return props.menuItems;
    }
    // @ts-ignore: Issues with proper typing here. Ignored for now
    return matchSorter(props.menuItems, filter, {
      keys: [
        item => {
          return item.menu && item.menu.map(subItem => subItem.name); // Get nested items first
        },
        'name',
      ],
    });
  }, [filter, props.menuItems]);
  React.useEffect(() => {
    props.propagateFilteredSearch(filteredMenuItems);
  }, [filteredMenuItems]);

  React.useEffect(() => {
    function handleSlashKeyUp(e: KeyboardEvent) {
      if (
        e.key === '/' &&
        document.activeElement &&
        document.activeElement.tagName != 'INPUT'
      ) {
        e.stopPropagation();
        inputRef.current!.focus();
      }
    }
    function handleEscapeKeyUp(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        inputRef.current!.blur();
      }
    }
    if (!focus) {
      document.addEventListener('keyup', handleSlashKeyUp);
    }
    if (focus) {
      document.addEventListener('keyup', handleEscapeKeyUp);
    }
    return () => {
      document.removeEventListener('keyup', handleSlashKeyUp);
      document.removeEventListener('keyup', handleEscapeKeyUp);
    };
  });

  return (
    <Contrast className="searchbar-wrapper">
      <TextField
        prepend={<SearchIcon />}
        placeholder="Søk..."
        value={filter}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
          setFilter(e.target.value)
        }
        width="fluid"
        ref={inputRef}
      />
    </Contrast>
  );
}
