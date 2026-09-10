import { Card, Stack, Text, TextInput } from '@sanity/ui';
import React, { useEffect, useState } from 'react';
import { StringInputProps, set, unset, useClient } from 'sanity';

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

export const AutocompleteTagInput = (props: StringInputProps) => {
  const client = useClient({ apiVersion: '2025-02-10' });
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const result = await client.fetch<Array<{ tag?: string }>>(
          `*[_type in ["page", "componentDoc"] && defined(tag)] { tag }`,
        );
        const allTags = result
          .map(doc => doc.tag?.toLowerCase())
          .filter((t): t is string => Boolean(t));
        setOptions([...new Set(allTags)].sort());
      } catch (error) {
        console.error('Error fetching tags:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [client]);

  useEffect(() => {
    if (props.value && !searchTerm) {
      setSearchTerm(props.value.toLowerCase());
    }
  }, [props.value, searchTerm]);

  const handleSelect = (selectedTag: string) => {
    const lowercaseTag = selectedTag.toLowerCase();
    props.onChange(set(lowercaseTag));
    setSearchTerm(lowercaseTag);
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lowercaseValue = e.target.value.toLowerCase();
    setSearchTerm(lowercaseValue);
    setShowDropdown(true);
    if (lowercaseValue) {
      props.onChange(set(lowercaseValue));
    } else {
      props.onChange(unset());
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
    if (props.value && !searchTerm) {
      setSearchTerm(props.value.toLowerCase());
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const filteredOptions = options.filter(tag => tag.includes(searchTerm));

  if (loading) {
    return (
      <Text size={1} muted>
        Laster tags …
      </Text>
    );
  }

  return (
    <Stack style={{ position: 'relative' }}>
      <TextInput
        value={capitalize(searchTerm)}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="Søk eller skriv inn en ny tag …"
      />
      {showDropdown && (
        <Card
          shadow={2}
          radius={2}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          <Stack>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(tag => (
                <Card
                  key={tag}
                  as="button"
                  padding={3}
                  radius={1}
                  tone="default"
                  style={{
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    border: 'none',
                  }}
                  onClick={() => handleSelect(tag)}
                >
                  <Text size={1}>{capitalize(tag)}</Text>
                </Card>
              ))
            ) : searchTerm ? (
              <Card padding={3}>
                <Text size={1} muted>
                  Ingen eksisterende tags funnet. &ldquo;
                  {capitalize(searchTerm)}&rdquo; blir lagt til som en ny tag.
                </Text>
              </Card>
            ) : (
              <Card padding={3}>
                <Text size={1} muted>
                  {options.length > 0
                    ? `${options.length} tags finnes. Skriv for å filtrere.`
                    : 'Ingen tags finnes ennå. Skriv for å legge til en ny.'}
                </Text>
              </Card>
            )}
          </Stack>
        </Card>
      )}
    </Stack>
  );
};
