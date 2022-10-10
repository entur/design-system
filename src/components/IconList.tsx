import { useToast } from '@entur/alert';
import { IconButton } from '@entur/button';
import { Dropdown } from '@entur/dropdown';
import { Switch, TextField } from '@entur/form';
import { DownloadIcon, CopyIcon, SearchIcon } from '@entur/icons';
import { fontSizes } from '@entur/tokens';
import { Tooltip } from '@entur/tooltip';
import { GridContainer, GridItem } from '@entur/grid';
import { Heading4, SubLabel } from '@entur/typography';
import classNames from 'classnames';
import copy from 'copy-text-to-clipboard';
import { matchSorter } from 'match-sorter';
import React from 'react';
import { useGetIcons } from '../gatsby-theme-docz/components/useGetIcons';
import './IconList.scss';

type IconListProps = {
  icons: {
    [key: string]: React.ElementType;
  };
};
const ICON_SIZES = [
  { label: 'Small', value: fontSizes.small.toString() },
  { label: 'Medium', value: fontSizes.medium.toString() },
  { label: 'Large', value: fontSizes.large.toString() },
  { label: '2XLarge', value: fontSizes.extraLarge2.toString() },
  { label: '3XLarge', value: fontSizes.extraLarge3.toString() },
  { label: '4XLarge', value: fontSizes.extraLarge4.toString() },
];

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

const unique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const IconList: React.FC<IconListProps> = props => {
  const { addToast } = useToast();
  const iconsQuery = useGetIcons();
  const [isContrast, setContrast] = React.useState(false);
  const [filterString, setFilterString] = React.useState('');
  const [iconSize, setIconSize] = React.useState<{
    label: string;
    value: string;
  } | null>({
    label: '2XLarge',
    value: fontSizes.extraLarge2.toString(),
  });
  const [category, setCategory] = React.useState<{
    value: string;
    label: string;
  } | null>({ value: '', label: '' });

  const categoriesMap = iconsQuery.map(icon => {
    return {
      category: icon.node.absolutePath.split('/').splice(-2, 1).toString(),
      name: icon.node.name.replace(/\s+/g, '') + 'Icon',
    };
  });

  const categories = iconsQuery
    .map(icon => icon.node.absolutePath.split('/').splice(-2, 1).toString())
    .filter(unique)
    .sort();

  const grouped = groupBy(
    categoriesMap,
    (category: { category: string; name: string }) => category.category,
  );

  const filteredIcons = React.useMemo(() => {
    const isCategorySelected = category !== null && category?.value !== '';
    const iconEntries = Object.entries(props.icons);
    const filteredOnCategory =
      isCategorySelected &&
      iconEntries.filter(icon => {
        const k = grouped.get(category.value);
        return k.some(l => l.name === icon[0]);
      });
    const returnIcons = isCategorySelected ? filteredOnCategory : iconEntries;
    if (filterString === '') {
      return returnIcons;
    }

    return matchSorter(returnIcons, filterString, { keys: ['0'] });
  }, [filterString, props.icons, category, grouped]);

  const noHits = filteredIcons.length === 0;
  const feedbackText =
    filterString.length > 0
      ? `${filteredIcons.length}\u00A0treff på søket ditt`
      : undefined;

  const handleIconClick = (iconName: string) => () => {
    copy(iconName);
    addToast({
      title: `"${iconName}"\u00A0kopiert!`,
      content: 'Du finner det i utklippstavla',
    });
  };

  return (
    <div>
      <Heading4 as="div" style={{ marginBottom: '1rem' }}>
        Filter
      </Heading4>
      <GridContainer spacing="medium">
        <GridItem small={12} medium={6}>
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
        </GridItem>
        <GridItem small={6} medium={3}>
          <Dropdown
            items={ICON_SIZES}
            value={iconSize?.value}
            onChange={e => setIconSize(e)}
            label="Ikonstørrelse"
          />
        </GridItem>
        <GridItem small={6} medium={3}>
          <Dropdown
            label="Kategori"
            items={categories}
            value={category?.value}
            onChange={e => setCategory(e)}
            clearable
          />
        </GridItem>
      </GridContainer>
      {!noHits && (
        <>
          <div style={{ display: 'flex' }}>
            <Switch
              checked={isContrast}
              onChange={() => setContrast(prev => !prev)}
              style={{ margin: '1rem 0' }}
            >
              Kontrast
            </Switch>
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
                  <CopyIcon />
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
