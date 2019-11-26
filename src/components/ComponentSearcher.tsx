import React from 'react';
import { InputGroup, TextField } from '@entur/form';
import { space } from '@entur/tokens';
import {
  allComponentsAlphabetically,
  ComponentRepresentationType,
} from '../utils/componentList';

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
  }, [allComponentsAlphabetically, query]);

  let feedbackProps = {};
  if (!searchResults.length) {
    feedbackProps = { variant: 'error', feedback: 'Ingen treff!' };
  } else if (searchResults.length < allComponentsAlphabetically.length) {
    feedbackProps = {
      feedback: `${searchResults.length} søkeresultat${
        searchResults.length !== 1 ? 'er' : ''
      }`,
      variant: 'info',
    };
  }

  return (
    <div>
      <InputGroup
        label="Søk etter komponenter"
        {...feedbackProps}
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
      {searchResults.map(children)}
    </div>
  );
};
