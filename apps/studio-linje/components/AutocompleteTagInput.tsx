import React, { useEffect, useState } from 'react';
import { useClient } from 'sanity';
import { StringInputProps, set, unset } from 'sanity';

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
          .map(doc => doc.tag)
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
      setSearchTerm(props.value);
    }
  }, [props.value, searchTerm]);

  const handleSelect = (tag: string) => {
    props.onChange(set(tag));
    setSearchTerm(tag);
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

  const filteredOptions = options.filter(tag =>
    tag.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return <div>Laster tags …</div>;
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder="Søk eller skriv inn en ny tag …"
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
          boxSizing: 'border-box',
        }}
      />

      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto',
            zIndex: 1000,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map(tag => (
              <div
                key={tag}
                onClick={() => handleSelect(tag)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0',
                  fontSize: '14px',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                {tag}
              </div>
            ))
          ) : searchTerm ? (
            <div
              style={{
                padding: '8px 12px',
                color: '#666',
                fontSize: '14px',
                fontStyle: 'italic',
              }}
            >
              Ingen eksisterende tags funnet. &ldquo;{searchTerm}&rdquo; blir
              lagt til som en ny tag.
            </div>
          ) : (
            <div
              style={{
                padding: '8px 12px',
                color: '#666',
                fontSize: '14px',
                fontStyle: 'italic',
              }}
            >
              {options.length > 0
                ? `${options.length} tags finnes. Skriv for å filtrere.`
                : 'Ingen tags finnes ennå. Skriv for å legge til en ny.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
