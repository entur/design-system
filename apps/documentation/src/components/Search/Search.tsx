import React, { useRef, useState } from 'react';
import { graphql, useStaticQuery, Link as GatsbyLink } from 'gatsby';
// @ts-expect-error react-use-flexsearch is missing type declerations
import { useFlexSearch } from 'react-use-flexsearch';
import { Modal } from '@entur/modal';

import { TextField } from '@entur/form';
import { UnorderedList, Heading5 } from '@entur/typography';
import { ListItem } from '@entur/typography';
import { SearchIcon } from '@entur/icons';

import { Tag } from '@entur/layout';
import { SmallText } from '@entur/typography';
import { Heading2 } from '@entur/typography';

import './Search.scss';
import { IconButton } from '@entur/button';
import { Paragraph } from '@entur/typography';

type StoreResult = {
  id: string;
  path: string | null;
  title: string | null;
  description: string | null;
  npmPackage?: string | null;
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
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

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
      <IconButton className="searchmodal__button" onClick={() => setOpen(true)}>
        <SearchIcon /> <span>Søk</span>
      </IconButton>
      <Modal
        size="medium"
        open={open}
        onDismiss={handleDismiss}
        initialFocusRef={searchbarRef}
        className="searchmodal"
      >
        <TextField
          label="Søk i vei!"
          value={searchQuery}
          onChange={event => setSearchQuery(event.currentTarget.value)}
          ref={searchbarRef}
          append={<SearchIcon />}
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
          />
          <ListSection
            group={resourceGroup}
            title="Ressurser"
            handleDismiss={handleDismiss}
          />
          <ListSection
            group={remainingGroup}
            title="Andre sider"
            handleDismiss={handleDismiss}
          />
        </UnorderedList>
      </Modal>
    </>
  );
};

const ListSection = (props: {
  group: StoreResult[];
  title: string;
  handleDismiss: () => void;
}) => {
  const { group, title, handleDismiss } = props;

  if (group.length === 0) return <></>;
  return (
    <>
      <Heading5 as={Heading2}>{title}</Heading5>
      {group.map(result => (
        <ListElement result={result} handleDismiss={handleDismiss} />
      ))}
    </>
  );
};

const ListElement = (props: {
  result: StoreResult;
  handleDismiss: () => void;
}) => {
  const { result, handleDismiss } = props;
  return (
    <ListItem className="searchmodal__list__item">
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
    description: 'Se en oversikt over alle ikoner designsystemet tilbyr.',
    npmPackage: 'icons',
  },
  {
    id: 'illustrations',
    path: '/identitet/verktoykassen/illustrasjoner',
    title: 'Illustrasjoner',
    description:
      'Se og last ned alle illustrasjoner i designsystemet sitt arsenal.',
  },
  {
    id: 'use-tokens',
    path: '/tokens/fargetokens/generelt#bruk-fargetokens',
    title: 'Bruke fargetokens',
    description: 'Les om fargetokens og hvordan du kan bruke dem.',
  },
  {
    id: 'get-started',
    path: '/kom-i-gang',
    title: 'Kom igang',
    description:
      'Les om hvordan du kan komme igang med å bruke designsystemet til Entur.',
  },
  {
    id: 'user-stories',
    path: '/kom-i-gang/for-designere/brukerhistorier',
    title: 'Brukerhistorier',
    description:
      'Hva er en brukerhistorie, hvorfor er det nyttig og hvordan bruker jeg det egentlig?',
  },
];
