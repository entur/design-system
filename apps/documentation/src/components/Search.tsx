import React, { useState } from 'react';
import { graphql, useStaticQuery, Link as GatsbyLink } from 'gatsby';
// @ts-expect-error react-use-flexsearch is missing type declerations
import { useFlexSearch } from 'react-use-flexsearch';

import { TextField } from '@entur/form';
import { UnorderedList, Link } from '@entur/typography';
import { ListItem } from '@entur/typography';

type StoreResult = {
  id: string;
  path: string | null;
  title: string | null;
  description: string | null;
};

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const data = useStaticQuery(graphql`
    query indexQuery {
      index: localSearchPages(name: { eq: "pages" }) {
        index
        store
      }
    }
  `);

  const results: StoreResult[] = useFlexSearch(
    searchQuery,
    data.index.index,
    data.index.store,
  ).filter((result: StoreResult) => result.path !== null);
  console.log(results);

  return (
    <>
      <TextField
        label="søk"
        value={searchQuery}
        onChange={event => setSearchQuery(event.currentTarget.value)}
      />
      <UnorderedList>
        {results.map(result => (
          <ListItem>
            <Link as={GatsbyLink} to={result.path}>
              {result.title}:<br />
              {result.description?.slice(0, 25)}…
            </Link>
          </ListItem>
        ))}
      </UnorderedList>
    </>
  );
};
