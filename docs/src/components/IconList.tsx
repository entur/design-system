import React from 'react';
import classNames from 'classnames';
import copy from 'copy-text-to-clipboard';
import { TextField, FormGroup } from '@entur/form';
import { SearchIcon, ReportsIcon } from '@entur/icons';
import matchSorter from 'match-sorter';
import './IconList.scss';
import ToggleSwitch from './ToggleSwitch';
import { Heading4 } from '@entur/typography';

type IconListProps = {
  icons: {
    [key: string]: React.ElementType;
  };
};
const IconList: React.FC<IconListProps> = props => {
  const [isContrast, setContrast] = React.useState(false);
  const [filterString, setFilterString] = React.useState('');
  const filteredIcons = React.useMemo(() => {
    const iconEntries = Object.entries(props.icons);
    if (filterString === '') {
      return iconEntries;
    }

    return matchSorter(iconEntries, filterString, { keys: ['0'] });
  }, [filterString, props.icons]);
  const noHits = filteredIcons.length === 0;
  const feedbackText =
    filterString.length > 0
      ? `${filteredIcons.length} treff på søket ditt`
      : undefined;
  return (
    <div>
      <FormGroup
        label="Søk etter ikon"
        feedback={feedbackText}
        variant={noHits ? 'error' : 'info'}
      >
        <TextField
          placeholder="eks. bicycle"
          value={filterString}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilterString(e.target.value)
          }
          prepend={<SearchIcon />}
        />
      </FormGroup>
      {!noHits && (
        <>
          <Heading4>Filter</Heading4>
          <ToggleSwitch
            checked={isContrast}
            onChange={() => setContrast(prev => !prev)}
          >
            Kontrast
          </ToggleSwitch>
          <ul
            className={classNames('icon-list', {
              'entur-contrast': isContrast,
            })}
          >
            {filteredIcons.map(([iconName, Icon]: any) => (
              <li className="icon-list__item" key={iconName}>
                <Icon width="2em" height="2em" />
                <button
                  className="icon-list__name"
                  onClick={() => copy(iconName)}
                >
                  {iconName} <ReportsIcon />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default IconList;
