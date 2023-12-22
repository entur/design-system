import React from 'react';
import classNames from 'classnames';
import copy from 'copy-text-to-clipboard';
import { Searcher, search } from 'fast-fuzzy';

import { useToast } from '@entur/alert';
import { IconButton, SecondaryButton } from '@entur/button';
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
import {
  Heading2,
  Heading3,
  Heading4,
  Link,
  ListItem,
  SubLabel,
  UnorderedList,
} from '@entur/typography';

import { useGetIcons } from '../gatsby-theme-docz/components/useGetIcons';

import './IconList.scss';

type IconListProps = {
  icons: {
    [key: string]: React.Component<any, any>;
  }[];
};
type IconListItem = {
  category: string;
  rootCategory?: string;
  name: string;
  component: {
    [key: string]: React.Component<any, any, any>;
  };
  downloadUrl: string;
};

const ICON_SIZES = [
  { label: 'Small', value: fontSizes.small.toString() },
  { label: 'Medium', value: fontSizes.medium.toString() },
  { label: 'Large', value: fontSizes.large.toString() },
  { label: '2XLarge', value: fontSizes.extraLarge2.toString() },
  { label: '3XLarge', value: fontSizes.extraLarge3.toString() },
  { label: '4XLarge', value: fontSizes.extraLarge4.toString() },
];

const unique = (value: string, index: number, listWithItems: string[]) => {
  return listWithItems.indexOf(value) === index;
};

const IconList: React.FC<IconListProps> = ({ icons: allIconComponents }) => {
  const { addToast } = useToast();
  const iconsQuery = useGetIcons();
  const [isContrast, setContrast] = React.useState(false);
  const [searchString, setSearchString] = React.useState('');
  const [iconSize, setIconSize] = React.useState<NormalizedDropdownItemType>(
    ICON_SIZES[ICON_SIZES.length - 1],
  );
  const [selectedCategory, setSelectedCategory] =
    React.useState<NormalizedDropdownItemType | null>(null);

  const allIcons = React.useMemo(
    () =>
      iconsQuery.map(icon => {
        const iconName = icon.node.name.replace(/\s+/g, '') + 'Icon';
        const iconComponent = Object.entries(allIconComponents).find(
          iconComponent => iconComponent?.[0] === iconName,
        )?.[1];
        const downloadUrl = icon.node.publicURL;

        const category =
          icon.node.absolutePath.match(/icons\/(.*?)\/[^/]+\.svg/)?.[1] ??
          'None';
        const rootCategory = category.split('/')[1];

        return {
          category: category,
          rootCategory: rootCategory,
          name: iconName,
          component: iconComponent,
          downloadUrl: downloadUrl,
        } as IconListItem;
      }),
    [iconsQuery, allIconComponents],
  );

  const SEARCH_OPTIONS = React.useMemo(
    () => ({
      keySelector: (icon: IconListItem) => icon.name,
      threshold: 0.8,
    }),
    [],
  );

  const searcherAllIcons = React.useMemo(
    () => new Searcher(allIcons, SEARCH_OPTIONS),
    [allIcons, SEARCH_OPTIONS],
  );

  const displayedIcons = React.useMemo(() => {
    const categoryIsSelected = selectedCategory !== null;

    if (!categoryIsSelected) {
      if (searchString === '') return allIcons;
      return searcherAllIcons.search(searchString);
    }

    const iconsInSelectedCategory = allIcons.filter(
      icon => icon.category === selectedCategory.value,
    );

    if (searchString === '') return iconsInSelectedCategory;

    return search(searchString, iconsInSelectedCategory, SEARCH_OPTIONS);
  }, [
    allIcons,
    searchString,
    selectedCategory,
    searcherAllIcons,
    SEARCH_OPTIONS,
  ]);

  const categories = allIcons
    .map(icon => icon.category)
    .filter(unique)
    .sort();

  const noResults = displayedIcons.length === 0;
  const numberOfResultsString = `${displayedIcons.length}\u00A0ikoner`;

  const handleIconClick = (iconName: string) => () => {
    copy(iconName);
    addToast({
      title: `"${iconName}"\u00A0kopiert!`,
      content: 'Du finner det i utklippstavla',
    });
  };

  const resetFilter = () => {
    setSearchString('');
    setSelectedCategory(null);
  };

  return (
    <div>
      <GridContainer spacing="medium">
        <GridItem small={12} medium={4}>
          <TextField
            label="Søk etter ikon"
            value={searchString}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchString(e.target.value)
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
            selectedItem={selectedCategory}
            onChange={setSelectedCategory}
          />
        </GridItem>
      </GridContainer>
      {noResults ? (
        <div className="icon-list__no-results">
          <Heading2 as="h3">Finner ingen ikoner</Heading2>
          <SecondaryButton
            className="icon-list__no-results__reset-filter"
            size="small"
            onClick={resetFilter}
          >
            Nullstill søk
          </SecondaryButton>
          <Heading4>Her er noen forslag til hva du kan gjøre:</Heading4>
          <UnorderedList>
            <ListItem>Prøv å bruke synonymer for «{searchString}»</ListItem>
            <ListItem>
              Prøv å beskrive handlingen til ikonet i stedet for utseende, eks.
              «search» i stedet for «magnifying glass»
            </ListItem>
            <ListItem>Søk på engelsk</ListItem>
            <ListItem>
              Hvis ikonet ikke eksisterer, meld det inn til oss på{' '}
              <Link href="https://entur.slack.com/archives/C899QSPB7">
                #talk-designsystem
              </Link>
              , så hjelper vi deg!
            </ListItem>
          </UnorderedList>
        </div>
      ) : (
        <>
          <div className="icon-list__header">
            <Switch
              checked={isContrast}
              onChange={() => setContrast(prev => !prev)}
            >
              Kontrast
            </Switch>
            <span>{numberOfResultsString}</span>
          </div>
          <ul className="icon-list">
            {displayedIcons.map(
              ({ name: iconName, component: Icon, downloadUrl }) => (
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
                    <span>{iconName}</span>
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
                        href={downloadUrl}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </li>
              ),
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default IconList;
