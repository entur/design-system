import React, { useEffect, useState } from 'react';
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
import { useSettings } from '@providers/SettingsContext';
import './Props.scss';

// Utility functions for formatting prop types
// TODO removeDeprecatedVariantType only removes deprecated variant types that have VariantType. And it does not check if it removes from the correct component. It should be more specific.
function removeDeprecatedVariantType(type: string) {
  const deprecatedVariantTypes = ['error', 'danger', 'info'];
  const types = type.split(' | ');

  if (
    types.some(t => deprecatedVariantTypes.includes(t.trim().replace(/"/g, '')))
  ) {
    return types
      .map(t => t.trim().replace(/"/g, ''))
      .filter(t => !deprecatedVariantTypes.includes(t))
      .map(t => `"${t}"`)
      .join(' | ');
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
  if (typeName.includes('VariantType')) {
    const VariantType = '"success" | "negative" | "warning" | "information"';
    return typeName
      .split(' | ')
      .map(t => (t === 'VariantType' ? VariantType : t))
      .join(' | ');
  }
  return typeName;
}

function formatPropType(typeName: string) {
  return removeDeprecatedVariantType(
    skipUndefinedType(resolveVariantType(typeName)),
  );
}

type PropsProps = {
  componentName: string;
  defaultOpen?: boolean;
};

const Props: React.FC<PropsProps> = ({ componentName, defaultOpen }) => {
  const { userType } = useSettings();
  const [componentProps, setComponentProps] = useState<any>(null);

  useEffect(() => {
    // Dynamically import the JSON data for the component
    import(`./eds-component-props/${componentName}.json`)
      .then(data => {
        setComponentProps(data[0]?.props || {});
      })
      .catch(error => {
        console.error('Failed to load component props data:', error);
      });
  }, [componentName]);

  if (!componentProps) {
    return <Paragraph>Denne komponenten har ingen props</Paragraph>;
  }

  const hasAnyDefaultValues = Object.values(componentProps).some(
    (details: any) => details.defaultValue,
  );

  const isDefaultOpenSet = defaultOpen !== undefined;

  return (
    <ExpandableText
      title={`${componentName} Props`}
      defaultOpen={isDefaultOpenSet ? defaultOpen : userType === 'developer'}
    >
      {Object.keys(componentProps).length > 0 ? (
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
            {Object.entries(componentProps).map(
              ([propName, details]: [string, any]) => (
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
                        <CodeText>
                          {String(details.defaultValue.value)}
                        </CodeText>
                      ) : null}
                    </DataCell>
                  )}
                  <DataCell className="props__description">
                    {details.description || ''}
                  </DataCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      ) : (
        <Paragraph>Denne komponenten har ingen props</Paragraph>
      )}
    </ExpandableText>
  );
};

export default Props;
