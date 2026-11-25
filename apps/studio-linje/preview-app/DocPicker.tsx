import React, { useEffect, useMemo, useState } from 'react';
import type { SanityClient } from '@sanity/client';
import { TextField } from '@entur/form';
import { SearchIcon } from '@entur/icons';
import {
  Heading,
  Link,
  ListItem,
  Text,
  TextContainer,
  UnorderedList,
} from '@entur/typography/beta';

type DocSummary = {
  _id: string;
  title?: string;
  category?: string;
  subcategory?: string;
};

// A subpage is listed under the category of its parent, as in the site menu
const QUERY = `*[_type in ["componentDoc", "page"] && !(_id in path("drafts.**"))] {
  _id,
  title,
  "category": coalesce(parentPage->category, category),
  "subcategory": coalesce(parentPage->subcategory, subcategory)
} | order(category asc, subcategory asc, title asc)`;

const groupName = ({ category, subcategory }: DocSummary) =>
  [category ?? 'Uten kategori', subcategory].filter(Boolean).join(' › ');

// The start page of the preview: every page, grouped as in the site menu
export function DocPicker({
  client,
  onSelect,
}: {
  client: SanityClient;
  onSelect: (id: string) => void;
}) {
  const [docs, setDocs] = useState<DocSummary[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Without stega: an edit overlay on a title would take the click
    client
      .withConfig({ stega: false })
      .fetch<DocSummary[]>(QUERY)
      .then(setDocs);
  }, [client]);

  const groups = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matches = docs.filter(doc =>
      (doc.title ?? '').toLowerCase().includes(term),
    );
    const byGroup = new Map<string, DocSummary[]>();
    for (const doc of matches) {
      const key = groupName(doc);
      byGroup.set(key, [...(byGroup.get(key) ?? []), doc]);
    }
    return [...byGroup];
  }, [docs, search]);

  return (
    <main style={{ maxWidth: '50rem', padding: '2rem' }}>
      <TextContainer>
        <Text variant="overline">Forhåndsvisning</Text>
        <Heading as="h1" variant="title-1">
          Velg en side
        </Heading>
        <TextField
          label="Søk etter side"
          prepend={<SearchIcon aria-hidden />}
          value={search}
          onChange={event => setSearch(event.target.value)}
        />
        {groups.map(([group, items]) => (
          <section key={group}>
            <Heading as="h2" variant="subtitle-1">
              {group}
            </Heading>
            <UnorderedList>
              {items.map(doc => (
                <ListItem key={doc._id}>
                  <Link
                    href={`?id=${doc._id}`}
                    onClick={event => {
                      event.preventDefault();
                      onSelect(doc._id);
                    }}
                  >
                    {doc.title ?? 'Uten tittel'}
                  </Link>
                </ListItem>
              ))}
            </UnorderedList>
          </section>
        ))}
        {docs.length > 0 && groups.length === 0 && (
          <Text>Ingen sider passer søket.</Text>
        )}
      </TextContainer>
    </main>
  );
}
