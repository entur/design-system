import React from 'react';
import { Label } from '@entur/typography';
import { TextField, FormGroup } from '@entur/form';
import matchSorter from 'match-sorter';
import './IconList.scss';

type IconListProps = {
  icons: {
    [key: string]: React.ElementType;
  };
};
const IconList: React.FC<IconListProps> = props => {
  const [filter, setFilter] = React.useState('');
  const filteredIcons = React.useMemo(() => {
    const iconEntries = Object.entries(props.icons);
    if (filter === '') {
      return iconEntries;
    }

    return matchSorter(iconEntries, filter, { keys: ['0'] });
  }, [filter, props.icons]);
  return (
    <div>
      <FormGroup variant="none" label="Filtrer ikoner">
        <TextField
          placeholder="Søk..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </FormGroup>
      <ul className="icon-list">
        {filteredIcons.map(([iconName, Icon]: any) => (
          <li className="icon-list__item" key={iconName}>
            <Icon width="4em" height="4em" />
            <Label as="div">{iconName}</Label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IconList;
