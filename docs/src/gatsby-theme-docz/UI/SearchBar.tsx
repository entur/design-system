import React from 'react';
import { TextField } from '@entur/form';
import { MenuItem } from 'docz';
import matchSorter from 'match-sorter';
import { Contrast } from '@entur/layout';
import { SearchIcon } from '@entur/icons';
import './SearchBar.scss';

type SearchBarProps = {
  menuItems: MenuItem[];
  onFilteredSearchChange: Function; //(menuItems: MenuItem[]) => void;
};

export function SearchBar(props: SearchBarProps) {
  const [filter, setFilter] = React.useState('');
  const [focus, setFocus] = React.useState(false);
  let inputRef = React.useRef<HTMLInputElement>();
  let previousFocusRef = React.useRef<HTMLElement>();

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
    props.onFilteredSearchChange(filteredMenuItems);
  }, [filteredMenuItems]);

  React.useEffect(() => {
    function handleKeyUp(e: KeyboardEvent) {
      switch (e.key) {
        case '/':
          if (
            !focus &&
            document.activeElement &&
            document.activeElement.tagName != 'INPUT'
          ) {
            previousFocusRef.current = document.activeElement as HTMLElement;
            e.stopPropagation();
            inputRef.current!.focus();
          }
          break;
        case 'Escape':
          if (focus) {
            previousFocusRef.current!.focus();
          }
          break;

        default:
      }
    }
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
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
