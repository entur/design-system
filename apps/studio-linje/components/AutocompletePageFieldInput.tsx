import { Card, Stack, Text, TextInput } from '@sanity/ui';
import React, { useEffect, useState } from 'react';
import { StringInputProps, set, unset, useClient } from 'sanity';

interface Option {
  title: string;
  value: string;
}

interface DynamicInputProps extends StringInputProps {
  fieldType: 'category' | 'subcategory';
}

export const AutocompletePageFieldInput = (props: DynamicInputProps) => {
  const { fieldType } = props;
  const client = useClient({ apiVersion: '2025-02-10' });
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const query = `*[_type == "page" && defined(${fieldType})] {
          ${fieldType}
        } | order(${fieldType} asc)`;

        const result = await client.fetch(query);
        let optionItems: Option[] = [];

        if (result && Array.isArray(result)) {
          const validValues = result
            .map((item: any) => item[fieldType])
            .filter((value: string) => value && typeof value === 'string');
          const uniqueValues = [...new Set(validValues)];
          optionItems = uniqueValues.map((value: string) => ({
            title: value,
            value: value,
          }));
        }

        setOptions(optionItems);
      } catch (error) {
        console.error(`Error fetching ${fieldType}s:`, error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [client, fieldType]);

  useEffect(() => {
    if (props.value && !searchTerm) {
      setSearchTerm(props.value);
    }
  }, [props.value, searchTerm]);

  const handleSelect = (option: Option) => {
    props.onChange(set(option.value));
    setSearchTerm(option.title);
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);
    if (value) {
      props.onChange(set(value));
    } else {
      props.onChange(unset());
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
    if (props.value && !searchTerm) {
      setSearchTerm(props.value);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const fieldName = fieldType === 'category' ? 'kategori' : 'underkategori';
  const placeholder = `Søk eller skriv inn en ny ${fieldName} …`;
  const filteredOptions = options.filter(option =>
    option.title?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <Text size={1} muted>
        Laster {fieldType}er …
      </Text>
    );
  }

  return (
    <Stack style={{ position: 'relative' }}>
      <TextInput
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
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
              filteredOptions.map(option => (
                <Card
                  key={option.value}
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
                  onClick={() => handleSelect(option)}
                >
                  <Text size={1}>{option.title}</Text>
                </Card>
              ))
            ) : searchTerm ? (
              <Card padding={3}>
                <Text size={1} muted>
                  Ingen eksisterende {fieldName}er funnet. &ldquo;{searchTerm}
                  &rdquo; blir lagt til som en ny {fieldName}.
                </Text>
              </Card>
            ) : (
              <Card padding={3}>
                <Text size={1} muted>
                  Skriv eller søk for å legge til en {fieldName}.
                </Text>
              </Card>
            )}
          </Stack>
        </Card>
      )}
      <Text size={1} muted>
        {options.length} {fieldName}er finnes.
      </Text>
    </Stack>
  );
};
