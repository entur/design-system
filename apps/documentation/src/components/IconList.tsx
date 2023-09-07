import { useToast } from '@entur/alert';
import { IconButton } from '@entur/button';
import {
  Dropdown,
  NormalizedDropdownItemType,
  SearchableDropdown,
} from '@entur/dropdown';
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
    [key: string]: React.Component<any, any>;
  }[];
};
const ICON_SIZES = [
  { label: 'Small', value: fontSizes.small.toString() },
  { label: 'Medium', value: fontSizes.medium.toString() },
  { label: 'Large', value: fontSizes.large.toString() },
  { label: '2XLarge', value: fontSizes.extraLarge2.toString() },
  { label: '3XLarge', value: fontSizes.extraLarge3.toString() },
  { label: '4XLarge', value: fontSizes.extraLarge4.toString() },
];

const mapIconsToCategories = iconList => {
  const map = new Map<
    string,
    Array<{
      category: string;
      name: string;
    }>
  >();
  iconList.forEach(icon => {
    const category = icon.category;
    const collection = map.get(category);
    if (collection !== undefined) {
      collection.push(icon);
    } else {
      map.set(category, [icon]);
    }

    // if category is eg. 'UI/Arrows', this will add the icon to 'UI' as well
    const rootCategory = category.split('/')[0];
    if (category !== rootCategory) {
      const rootCollection = map.get(rootCategory);
      if (rootCollection !== undefined) {
        rootCollection.push(icon);
      } else {
        map.set(rootCategory, [icon]);
      }
    }
  });
  return map;
};

const unique = (value: string, index: number, listWithItems: string[]) => {
  return listWithItems.indexOf(value) === index;
};

const IconList: React.FC<IconListProps> = ({ icons: iconComponents }) => {
  const { addToast } = useToast();
  const iconsQuery = useGetIcons();
  const [isContrast, setContrast] = React.useState(false);
  const [searchString, setFilterString] = React.useState('');
  const [iconSize, setIconSize] = React.useState<NormalizedDropdownItemType>({
    label: '2XLarge',
    value: fontSizes.extraLarge2.toString(),
  });
  const [category, setCategory] =
    React.useState<NormalizedDropdownItemType | null>(null);

  const allIcons = iconsQuery.map(icon => {
    const iconName = icon.node.name.replace(/\s+/g, '') + 'Icon';
    // console.log('entries', Object.entries(iconComponents));

    const iconComponent = Object.entries(iconComponents).find(
      component => component?.[0] === iconName,
    )?.[1];

    return {
      category:
        icon.node.absolutePath.match(/icons\/(.*?)\/[^\/]+\.svg/)?.[1] ??
        'None',
      name: iconName,
      component: iconComponent,
    };
  });

  const iconsMappedToCategory = mapIconsToCategories(allIcons);

  const filteredIcons = React.useMemo(() => {
    const isCategorySelected = category !== null;

    if (!isCategorySelected && searchString === '') return allIcons;

    if (isCategorySelected) {
      const filteredOnCategory = allIcons.filter(
        icon => icon.category === category.value,
      );

      if (searchString === '') return filteredOnCategory;

      return matchSorter(filteredOnCategory, searchString, { keys: ['0'] });
    }

    return matchSorter(allIcons, searchString, { keys: ['0'] });
  }, [category, searchString, allIcons]);

  const categories = allIcons
    .map(icon => icon.category)
    .filter(unique)
    .sort();

  const noHits = filteredIcons.length === 0;
  const feedbackText =
    searchString.length > 0
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
        <GridItem small={12} medium={4}>
          <TextField
            label="Søk etter ikon"
            feedback={feedbackText}
            variant={noHits ? 'error' : 'info'}
            value={searchString}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFilterString(e.target.value)
            }
            prepend={<SearchIcon aria-hidden="true" />}
          />
        </GridItem>
        <GridItem small={6} medium={4}>
          <Dropdown
            items={ICON_SIZES}
            selectedItem={iconSize}
            onChange={item => (item === null ? undefined : setIconSize(item))}
            label="Ikonstørrelse"
          />
        </GridItem>
        <GridItem small={6} medium={4}>
          <SearchableDropdown
            label="Kategori"
            items={() => categories}
            selectedItem={category}
            onChange={setCategory}
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
            {filteredIcons.map(({ name: iconName, component: Icon }) => (
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
                  <CopyIcon aria-label=", trykk for å kopiere til utklippstavlen" />
                </SubLabel>
                <Icon
                  style={{ width: iconSize?.value, height: iconSize?.value }}
                  aria-label={`Forhåndsvisning av ${iconName}-ikonet`}
                />
                <div className="icon-list__item-buttons">
                  <Tooltip
                    aria-hidden="true"
                    content="Last ned SVG"
                    placement="top"
                  >
                    <IconButton
                      as="a"
                      aria-label={`Last ned ${iconName}.svg`}
                      download
                      href={
                        iconsQuery
                          .filter(
                            icon =>
                              icon.node.name.split(' ').join('') + 'Icon' ===
                              iconName,
                          )
                          .map(node => node.node.publicURL)[0]
                      }
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
