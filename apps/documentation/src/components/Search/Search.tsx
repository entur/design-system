import React, { useRef, useState } from 'react';
import { graphql, useStaticQuery, Link as GatsbyLink } from 'gatsby';
// @ts-expect-error react-use-flexsearch is missing type declerations
import { useFlexSearch } from 'react-use-flexsearch';

import { Modal } from '@entur/modal';
import { SecondaryButton } from '@entur/button';
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
  const [open, setOpen] = useState(false);
  const searchbarRef = useRef(null);

  const NUMBER_OF_RESULTS = 10;

  const data = useStaticQuery(graphql`
    query indexQuery {
      index: localSearchPages(name: { eq: "pages" }) {
        index
        store
      }
    }
  `);

  // Toggle the menu when ⌘K is pressed
  React.useEffect(() => {
    const down = e => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
      if (open && e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open]);

  function handleDismiss() {
    setOpen(false);
    setSearchQuery('');
  }

  // Get the 10 most relevant results for the search
  const results: StoreResult[] = useFlexSearch(
    searchQuery,
    data.index.index,
    data.index.store,
    NUMBER_OF_RESULTS,
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

  return (
    <>
      <SecondaryButton
        aria-label="Søk"
        className="searchmodal__button"
        onClick={() => setOpen(true)}
        size="small"
      >
        <SearchIcon aria-hidden="ture" /> Søk …
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
          onChange={event => setSearchQuery(event.currentTarget.value)}
          ref={searchbarRef}
          prepend={<SearchIcon aria-hidden="true" />}
          className="searchmodal__searchbar"
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
            />
          )}
          <ListSection
            group={componentGroup}
            title="Komponenter"
            handleDismiss={handleDismiss}
            icon={<ComponentIcon {...LIST_ITEM_ICON_PROPS} />}
          />
          <ListSection
            group={resourceGroup}
            title="Ressurser"
            handleDismiss={handleDismiss}
            icon={<ColorPickerIcon {...LIST_ITEM_ICON_PROPS} />}
          />
          <ListSection
            group={remainingGroup}
            title="Andre sider"
            handleDismiss={handleDismiss}
            icon={<FileIcon {...LIST_ITEM_ICON_PROPS} />}
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
}) => {
  const { group, title, handleDismiss, icon } = props;

  if (group.length === 0) return <></>;
  return (
    <>
      <Heading5 as={Heading2}>{title}</Heading5>
      {group.map(result => (
        <ListElement
          result={result}
          handleDismiss={handleDismiss}
          icon={icon}
        />
      ))}
    </>
  );
};

const ListElement = (props: {
  result: StoreResult;
  handleDismiss: () => void;
  icon: any;
}) => {
  const { result, handleDismiss, icon } = props;
  return (
    <ListItem className="searchmodal__list__item">
      {icon ?? result.icon}
      <div className="searchmodal__list__item__text">
        <GatsbyLink
          className="searchmodal__list__item__text__link"
          to={result.path ?? '#'}
          onClick={handleDismiss}
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
    path: '/tokens/fargetokens/generelt#bruk-fargetokens',
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
