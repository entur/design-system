import { Card, Stack, Text, TextInput } from '@sanity/ui';
import React, { useEffect, useState } from 'react';
import { StringInputProps, set, unset, useFormValue } from 'sanity';
import { SECTION_TITLES_BY_TAB as TAB_SECTION_SUGGESTIONS } from '../titleSuggestions';

export const TitleSuggestionsInput =
  ({ suggestions }: { suggestions: string[] }) =>
  (props: StringInputProps) => {
    const tabsIdx = props.path.findIndex(seg => seg === 'tabs');
    const tabKeySegment = tabsIdx !== -1 ? props.path[tabsIdx + 1] : null;
    const tabKey =
      tabKeySegment &&
      typeof tabKeySegment === 'object' &&
      '_key' in tabKeySegment
        ? (tabKeySegment as { _key: string })._key
        : null;

    const tabTitle = useFormValue(
      tabKey ? ['tabs', { _key: tabKey }, 'title'] : ['title'],
    ) as string | undefined;

    const componentTitle = useFormValue(['title']) as string | undefined;

    const baseSuggestions =
      tabKey && tabTitle && TAB_SECTION_SUGGESTIONS[tabTitle]
        ? TAB_SECTION_SUGGESTIONS[tabTitle]
        : suggestions;

    const resolvedSuggestions =
      tabTitle === 'Oversikt'
        ? baseSuggestions.map(s =>
            s === 'Bruk' ? `Bruk ${componentTitle ?? 'komponenten'} når` : s,
          )
        : baseSuggestions;

    const [searchTerm, setSearchTerm] = useState(props.value ?? '');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
      setSearchTerm(props.value ?? '');
    }, [props.value]);

    const filtered = resolvedSuggestions.filter(s =>
      s.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleSelect = (value: string) => {
      props.onChange(set(value));
      setSearchTerm(value);
      setShowDropdown(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchTerm(val);
      setShowDropdown(true);
      if (val) {
        props.onChange(set(val));
      } else {
        props.onChange(unset());
      }
    };

    return (
      <Stack style={{ position: 'relative' }}>
        <TextInput
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Velg fra listen eller skriv fritekst …"
        />
        {showDropdown && filtered.length > 0 && (
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
              {filtered.map(s => (
                <Card
                  key={s}
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
                  type="button"
                  onClick={() => handleSelect(s)}
                >
                  <Text size={1}>{s}</Text>
                </Card>
              ))}
            </Stack>
          </Card>
        )}
      </Stack>
    );
  };
