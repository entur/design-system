import React, { useRef, useEffect, useState, useCallback } from 'react';
import { graphql, useStaticQuery, Link as GatsbyLink, navigate } from 'gatsby';
// @ts-expect-error react-use-flexsearch is missing type declerations
import { useFlexSearch } from 'react-use-flexsearch';
import classNames from 'classnames';

import { Modal } from '@entur/modal';
import { IconButton, SecondaryButton } from '@entur/button';
import { TextField } from '@entur/form';
import {
  ColorPickerIcon,
  ComponentIcon,
  FileIcon,
  IconIcon,
  NewIcon,
  SearchIcon,
  TokenIcon,
  UserIcon,
} from '@entur/icons';
import { Badge, Tag } from '@entur/layout';
import {
  UnorderedList,
  ListItem,
  Heading5,
  SmallText,
  Heading2,
  Paragraph,
} from '@entur/typography';
import { useSearch } from './SearchContext';

import './Search.scss';

type StoreResult = {
  id: string;
  path: string | null;
  title: string | null;
  description: string | null;
  npmPackage?: string | null;
  icon?: any;
};

let LIST_ITEM_ICON_PROPS = {
  inline: true,
  size: '1.25rem',
  'aria-hidden': true,
};

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchbarRef = useRef(null);
  const { isSearchOpen: open, closeSearch, openSearch } = useSearch();

  const NUMBER_OF_RESULTS = 10;

  const data = useStaticQuery(graphql`
    query indexQuery {
      index: localSearchPages(name: { eq: "pages" }) {
        index
        store
      }
    }
  `);

  // Get the 10 most relevant results for the search
  const results: StoreResult[] = useFlexSearch(
    searchQuery,
    data.index.index,
    data.index.store,
    { limit: NUMBER_OF_RESULTS, suggest: true },
  ).filter((result: StoreResult) => result.path !== null);

  const componentGroup = results.filter(result =>
    result.path?.includes('komponenter'),
  );
  const resourceGroup = results.filter(
    result =>
      result.path?.includes('verktoykassen') || result.path?.includes('maler'),
  );
  const remainingGroup = results.filter(
    result =>
      !(
        result.path?.includes('komponenter') ||
        result.path?.includes('verktoykassen') ||
        result.path?.includes('maler')
      ),
  );

  // Create a flat array of all navigable items for keyboard navigation
  const allItems: StoreResult[] = [];
  if (searchQuery === '' || (searchQuery !== '' && results.length === 0)) {
    allItems.push(...recommendedPages);
  }
  allItems.push(...componentGroup);
  allItems.push(...resourceGroup);
  allItems.push(...remainingGroup);

  const getStartIndexForSection = (sectionIndex: number): number => {
    const hasRecommendedPages =
      searchQuery === '' || (searchQuery !== '' && results.length === 0);
    const recommendedPagesCount = hasRecommendedPages
      ? recommendedPages.length
      : 0;

    switch (sectionIndex) {
      case 0: // Recommended pages
        return 0;
      case 1: // Component group
        return recommendedPagesCount;
      case 2: // Resource group
        return recommendedPagesCount + componentGroup.length;
      case 3: // Remaining group
        return (
          recommendedPagesCount + componentGroup.length + resourceGroup.length
        );
      default:
        return 0;
    }
  };

  const handleKeyboardNavigation = useCallback(
    (event: KeyboardEvent) => {
      if (!open) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => (prev < allItems.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : allItems.length - 1));
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < allItems.length) {
            const selectedItem = allItems[selectedIndex];
            if (selectedItem.path) {
              handleDismiss();
              navigate(selectedItem.path);
            }
          }
          break;
      }
    },
    [open, selectedIndex, allItems],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardNavigation);
    return () => {
      document.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, [handleKeyboardNavigation]);

  function updateSearchQuery(query: string) {
    setSearchQuery(query);
    setSelectedIndex(-1);
  }

  function handleDismiss() {
    closeSearch();
    updateSearchQuery('');
  }

  function handleItemSelect(index: number) {
    setSelectedIndex(index);
  }

  return (
    <>
      <SecondaryButton
        aria-label="Søk"
        className="searchmodal__button"
        onClick={openSearch}
        size="small"
      >
        <SearchIcon aria-hidden="true" /> Søk …
        <Badge as="kbd" variant="neutral" type="status">
          <span
            style={{
              marginRight: '0.25rem',
            }}
          >
            ⌘
          </span>
          k
        </Badge>
      </SecondaryButton>
      <IconButton className="searchmodal__button--small" onClick={openSearch}>
        <SearchIcon aria-hidden="true" />
      </IconButton>
      <Modal
        size="medium"
        open={open}
        onDismiss={handleDismiss}
        initialFocusRef={searchbarRef}
        className="searchmodal"
      >
        <TextField
          label="Søk i dokumentasjon"
          value={searchQuery}
          onChange={event => updateSearchQuery(event.currentTarget.value)}
          ref={searchbarRef}
          prepend={<SearchIcon aria-hidden="true" />}
          className="searchmodal__searchbar"
          onFocus={() => setSelectedIndex(-1)}
          onBlur={e => {
            // Hack to close menu on escape instead of un-focusing input field
            if (e.relatedTarget === null) closeSearch();
          }}
        />
        <UnorderedList className="searchmodal__list">
          {results.length === 0 && searchQuery !== '' && (
            <Paragraph>
              {
                'Fant ingen sider som passet med søket ditt 😔 \nHer er noen foreslåtte sider:'
              }
            </Paragraph>
          )}
          {(searchQuery === '' ||
            (searchQuery !== '' && results.length === 0)) && (
            <ListSection
              group={recommendedPages}
              title="Foreslått"
              handleDismiss={handleDismiss}
              selectedIndex={selectedIndex}
              startIndex={getStartIndexForSection(0)}
              onItemSelect={handleItemSelect}
            />
          )}
          <ListSection
            group={componentGroup}
            title="Komponenter"
            handleDismiss={handleDismiss}
            icon={<ComponentIcon {...LIST_ITEM_ICON_PROPS} />}
            selectedIndex={selectedIndex}
            startIndex={getStartIndexForSection(1)}
            onItemSelect={handleItemSelect}
          />
          <ListSection
            group={resourceGroup}
            title="Ressurser"
            handleDismiss={handleDismiss}
            icon={<ColorPickerIcon {...LIST_ITEM_ICON_PROPS} />}
            selectedIndex={selectedIndex}
            startIndex={getStartIndexForSection(2)}
            onItemSelect={handleItemSelect}
          />
          <ListSection
            group={remainingGroup}
            title="Andre sider"
            handleDismiss={handleDismiss}
            icon={<FileIcon {...LIST_ITEM_ICON_PROPS} />}
            selectedIndex={selectedIndex}
            startIndex={getStartIndexForSection(3)}
            onItemSelect={handleItemSelect}
          />
        </UnorderedList>
      </Modal>
    </>
  );
};

const ListSection = (props: {
  group: StoreResult[];
  title: string;
  icon?: any;
  handleDismiss: () => void;
  selectedIndex: number;
  startIndex: number;
  onItemSelect?: (index: number) => void;
}) => {
  const {
    group,
    title,
    handleDismiss,
    icon,
    selectedIndex,
    startIndex,
    onItemSelect,
  } = props;

  if (group.length === 0) return <></>;
  return (
    <>
      <Heading5 as={Heading2}>{title}</Heading5>
      {group.map((result, index) => (
        <ListElement
          key={result.id}
          result={result}
          handleDismiss={handleDismiss}
          icon={icon}
          isSelected={selectedIndex === startIndex + index}
          onSelect={() => onItemSelect?.(startIndex + index)}
        />
      ))}
    </>
  );
};

const ListElement = (props: {
  result: StoreResult;
  handleDismiss: () => void;
  icon: any;
  isSelected: boolean;
  onSelect?: () => void;
}) => {
  const { result, handleDismiss, icon, isSelected, onSelect } = props;
  return (
    <ListItem
      className={classNames('searchmodal__list__item', {
        'searchmodal__list__item--selected': isSelected,
      })}
      onMouseEnter={onSelect}
      tabIndex={-1}
    >
      {icon ?? result.icon}
      <div className="searchmodal__list__item__text">
        <GatsbyLink
          className="searchmodal__list__item__text__link"
          to={result.path ?? '#'}
          onClick={handleDismiss}
          onFocus={onSelect}
        >
          {result.title}
        </GatsbyLink>
        <SmallText>{result.description}</SmallText>
      </div>
      {result.npmPackage && (
        <Tag className="searchmodal__list__item__tag">
          @entur/{result.npmPackage}
        </Tag>
      )}
    </ListItem>
  );
};

const recommendedPages: StoreResult[] = [
  {
    id: 'icons',
    path: '/komponenter/ressurser/icons',
    title: 'Ikoner',
    description: 'Se en oversikt over alle ikoner Linje tilbyr.',
    npmPackage: 'icons',
    icon: <IconIcon {...LIST_ITEM_ICON_PROPS} />,
  },
  {
    id: 'illustrations',
    path: '/identitet/verktoykassen/illustrasjoner',
    title: 'Illustrasjoner',
    description: 'Se og last ned alle illustrasjoner i Linje sitt arsenal.',
    icon: <ColorPickerIcon {...LIST_ITEM_ICON_PROPS} />,
  },
  {
    id: 'use-tokens',
    path: '/tokens/fargetokens/generelt-om-fargetokens#bruk-fargetokens',
    title: 'Bruke fargetokens',
    description: 'Les om fargetokens og hvordan du kan bruke dem.',
    npmPackage: 'tokens',
    icon: <TokenIcon {...LIST_ITEM_ICON_PROPS} />,
  },
  {
    id: 'get-started',
    path: '/kom-i-gang',
    title: 'Kom igang',
    description:
      'Les om hvordan du kan komme igang med å bruke Linje – designsystemet til Entur.',
    icon: <NewIcon {...LIST_ITEM_ICON_PROPS} />,
  },
  {
    id: 'user-stories',
    path: '/kom-i-gang/for-designere/brukerhistorier',
    title: 'Brukerhistorier',
    description:
      'Hva er en brukerhistorie, hvorfor er det nyttig og hvordan bruker jeg det egentlig?',
    icon: <UserIcon {...LIST_ITEM_ICON_PROPS} />,
  },
];
