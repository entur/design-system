import React from 'react';
import { PropsComponentProps } from 'docz';
import { CodeText, Paragraph } from '@entur/typography';

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/table';
import { ExpandableText } from '@entur/expand';
import { useSettings } from '~/utils/Providers/SettingsContext';
import './Props.scss';

// removeDeprecatedVariantType only removes deprecated variant types that have VariantType. And it does not check if it removes from the correct component. It should be more specific.
// we need gatbsy 5 and gatbsy-mdx-plugin to get frontmatterdata from mdx files, that we can use to get the component name.
function removeDeprecatedVariantType(type: string) {
  const deprecatedVariantTypes = ['error', 'danger', 'info'];
  const types = type.split(' | ');

  // Check if any type is deprecated
  if (
    types.some(t => deprecatedVariantTypes.includes(t.trim().replace(/"/g, '')))
  ) {
    const filteredTypes = types
      .map(t => t.trim().replace(/"/g, ''))
      .filter(t => !deprecatedVariantTypes.includes(t));

    // Join the remaining types back into a single string with quotes
    return filteredTypes.map(t => `"${t}"`).join(' | ');
  } else {
    return type;
  }
}

function skipUndefinedType(type: string) {
  return type.replace(
    /((\| undefined)?(\| "undefined")?(\| ComponentProps<E>\[string\])?)/g,
    '',
  );
}

function resolveVariantType(typeName: string) {
  // Check if the typeName includes "VariantType"
  if (typeName.includes('VariantType')) {
    const VariantType = '"success" | "negative" | "warning" | "information"';

    // Extract individual types from the typeName
    const types = typeName.split(' | ');

    // Check if any of the types are custom types and replace them
    const resultTypes = types.map(t => {
      if (t === 'VariantType') {
        return VariantType;
      }
      return t;
    });

    const result = resultTypes.join(' | ');

    return result;
  }

  // If it doesn't include "VariantType", return the original typeName
  return typeName;
}

function formatPropType(typeName: string) {
  // Run resolveVariantType to handle VariantType
  let formattedType = resolveVariantType(typeName);

  // Run skipUndefinedType to handle undefined types
  formattedType = skipUndefinedType(formattedType);

  // Run removeDeprecatedVariantType to handle deprecated variant types
  formattedType = removeDeprecatedVariantType(formattedType);

  return formattedType;
}

type PropsProps = PropsComponentProps & {
  defaultOpen?: boolean;
  title?: string;
};

const Props: React.FC<PropsProps> = ({
  title = 'Props',
  props,
  defaultOpen,
}) => {
  const { userType } = useSettings();
  const hasAnyDefaultValues = Object.values(props).some(
    details => details.defaultValue,
  );
  const isDefaultOpenSet = defaultOpen !== undefined;
  return (
    <ExpandableText
      title={title}
      defaultOpen={isDefaultOpenSet ? defaultOpen : userType === 'developer'}
    >
      {Object.keys(props).length > 0 ? (
        <Table fixed spacing="middle">
          <TableHead>
            <TableRow>
              <HeaderCell>Navn</HeaderCell>
              <HeaderCell>Type</HeaderCell>
              {hasAnyDefaultValues && <HeaderCell>Default-verdi</HeaderCell>}
              <HeaderCell>Beskrivelse</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(props).map(([propName, details]) => (
              <TableRow key={propName}>
                <DataCell>
                  <CodeText>{`${propName}${
                    details.required ? '' : '?'
                  }`}</CodeText>
                </DataCell>
                <DataCell>
                  <CodeText className="props-table__type">
                    {propName === 'as'
                      ? 'string | React.ElementType'
                      : formatPropType(details.type.name)}
                  </CodeText>
                </DataCell>
                {hasAnyDefaultValues && (
                  <DataCell>
                    {details.defaultValue ? (
                      <CodeText>{String(details.defaultValue.value)}</CodeText>
                    ) : null}
                  </DataCell>
                )}
                <DataCell className="props__description">
                  {details.description}
                </DataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Paragraph>Denne komponenten har ingen props</Paragraph>
      )}
    </ExpandableText>
  );
};

// Define the GraphQL query

export default Props;
