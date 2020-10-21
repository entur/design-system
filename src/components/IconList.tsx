import { useToast } from '@entur/alert';
import { IconButton } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { Switch, TextField } from '@entur/form';
import { DownloadIcon, ReportsIcon, SearchIcon } from '@entur/icons';
import { fontSizes } from '@entur/tokens';
import { Tooltip } from '@entur/tooltip';
import { Heading4, SubLabel } from '@entur/typography';
import classNames from 'classnames';
import copy from 'copy-text-to-clipboard';
import matchSorter from 'match-sorter';
import React from 'react';
import { useGetIcons } from '../gatsby-theme-docz/components/useGetIcons';
import './IconList.scss';

type IconListProps = {
  icons: {
    [key: string]: React.ElementType;
  };
};
const IconList: React.FC<IconListProps> = props => {
  const [isContrast, setContrast] = React.useState(false);
  const [filterString, setFilterString] = React.useState('');
  const [iconSize, setIconSize] = React.useState<{
    label: string;
    value: string;
  } | null>({
    label: 'Medium',
    value: fontSizes.extraLarge2.toString(),
  });

  const [category, setCategory] = React.useState<string | null>(null);

  const iconSizes = [
    { label: 'Small', value: fontSizes.large.toString() },
    { label: 'Medium', value: fontSizes.extraLarge2.toString() },
    { label: 'Large', value: fontSizes.extraLarge4.toString() },
  ];
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

  const iconsQuery = useGetIcons();
  const unique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  const categories = iconsQuery
    .map(icon => icon.node.absolutePath.split('/').splice(-2, 1).toString())
    .filter(unique)
    .sort();

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
          <div style={{ display: 'flex' }}>
            <Switch
              checked={isContrast}
              onChange={() => setContrast(prev => !prev)}
            >
              Kontrast
            </Switch>
            {/* <Dropdown
              items={iconSizes}
              value={iconSize?.value}
              onChange={e => setIconSize(e)}
              label="Ikonstørrelse"
              style={{ width: '10rem' }}
            ></Dropdown>
            <Dropdown
              style={{ width: '10rem' }}
              label="Kategori"
              items={categories}
              clearable
            /> */}
          </div>
          <ul className="icon-list">
            {filteredIcons.map(([iconName, Icon]: any) => (
              <li
                className={classNames('icon-list__item', {
                  'eds-contrast': isContrast,
                })}
                key={iconName}
              >
                <SubLabel
                  as="button"
                  className="icon-list__item-name"
                  onClick={handleIconClick(iconName)}
                >
                  {iconName}
                  <ReportsIcon />
                </SubLabel>
                <Icon
                  style={{ width: iconSize?.value, height: iconSize?.value }}
                />
                <div className="icon-list__item-buttons">
                  <Tooltip content="Last ned SVG" placement="top">
                    <IconButton
                      as="a"
                      download
                      href={iconsQuery
                        .filter(
                          icon =>
                            icon.node.name.split(' ').join('') + 'Icon' ===
                            iconName,
                        )
                        .map(node => node.node.publicURL)}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default IconList;
