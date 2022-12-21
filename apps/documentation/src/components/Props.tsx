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
import { useSettings } from './SettingsContext';
import './Props.scss';

function skipUndefinedType(type: string) {
  return type.replace(
    /((\| undefined)?(\| ComponentProps<E>\[string\])?)/g,
    '',
  );
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
                      : skipUndefinedType(details.type.name)}
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

export default Props;
