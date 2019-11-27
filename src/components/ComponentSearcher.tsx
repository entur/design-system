import React from 'react';
import { InputGroup, TextField } from '@entur/form';
import { space } from '@entur/tokens';
import {
  allComponentsAlphabetically,
  ComponentRepresentationType,
} from '../utils/componentList';
import { Heading3 } from '@entur/typography';

type ComponentSearcherProps = {
  children: (component: ComponentRepresentationType) => React.ReactNode;
};
export const ComponentSearcher: React.FC<ComponentSearcherProps> = ({
  children,
}) => {
  const [query, setQuery] = React.useState('');

  const searchResults = React.useMemo(() => {
    const normalizedQuery = query.toLowerCase();
    if (normalizedQuery === '') {
      return allComponentsAlphabetically;
    }
    return allComponentsAlphabetically.filter(
      component =>
        component.exportName.toLowerCase().includes(normalizedQuery) ||
        component.packageName.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  return (
    <div>
      <InputGroup
        label="Søk etter komponenter"
        style={{ maxWidth: '20rem', marginBottom: space.extraLarge }}
      >
        <TextField
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          placeholder="f.eks. SideNavigationItem"
        />
      </InputGroup>
      <Heading3 as="p">
        {searchResults.length ? searchResults.length : 'Ingen'} treff
      </Heading3>
      {searchResults.map(children)}
    </div>
  );
};
