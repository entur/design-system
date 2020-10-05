import React from 'react';
import classNames from 'classnames';
import copy from 'copy-text-to-clipboard';
import { TextField } from '@entur/form';
import { SearchIcon, ReportsIcon } from '@entur/icons';
import { useToast } from '@entur/alert';
import matchSorter from 'match-sorter';
import './IconList.scss';
import { Switch } from '@entur/form';
import { Heading4 } from '@entur/typography';
import { TertiaryButton } from '@entur/button';

type IconListProps = {
  icons: {
    [key: string]: React.ElementType;
  };
};
const IconList: React.FC<IconListProps> = props => {
  const [isContrast, setContrast] = React.useState(false);
  const [filterString, setFilterString] = React.useState('');
  const { addToast } = useToast();
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

  const handleIconClick = (iconName: string) => () => {
    copy(iconName);
    addToast({
      title: `"${iconName}" kopiert!`,
      content: 'Du finner det i utklippstavla',
    });
  };
  return (
    <div>
      <TextField
        label="Søk etter ikon"
        feedback={feedbackText}
        variant={noHits ? 'error' : 'info'}
        value={filterString}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFilterString(e.target.value)
        }
        prepend={<SearchIcon />}
      />
      {!noHits && (
        <>
          <Heading4>Filter</Heading4>
          <Switch
            checked={isContrast}
            onChange={() => setContrast(prev => !prev)}
          >
            Kontrast
          </Switch>
          <ul
            className={classNames('icon-list', {
              'eds-contrast': isContrast,
            })}
          >
            {filteredIcons.map(([iconName, Icon]: any) => (
              <li className="icon-list__item" key={iconName}>
                <Icon style={{ width: '2em', height: '2em' }} />
                <TertiaryButton
                  onClick={handleIconClick(iconName)}
                  className="icon-list__name"
                >
                  {iconName} <ReportsIcon inline={true} />
                </TertiaryButton>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default IconList;
