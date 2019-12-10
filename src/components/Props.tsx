import React from 'react';
import { PropsComponentProps } from 'docz';
import { CodeText, Paragraph } from '@entur/typography';
import { CheckIcon } from '@entur/icons';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/table';
import { ExpandableText } from '@entur/expand';
import { colors } from '@entur/tokens';
import { useSettings } from './SettingsContext';
import './Props.scss';

function skipUndefinedType(type: string) {
  return type.replace(/\| undefined/g, '');
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
        <Table fixed compact>
          <TableHead>
            <TableRow>
              <HeaderCell>Navn</HeaderCell>
              <HeaderCell>Type</HeaderCell>
              <HeaderCell>Påkrevd?</HeaderCell>
              {hasAnyDefaultValues && <HeaderCell>Default-verdi</HeaderCell>}
              <HeaderCell>Beskrivelse</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(props).map(([propName, details]) => (
              <TableRow key={propName}>
                <DataCell>
                  <CodeText>{propName}</CodeText>
                </DataCell>
                <DataCell>
                  <CodeText>{skipUndefinedType(details.type.name)}</CodeText>
                </DataCell>
                <DataCell>
                  {details.required && (
                    <CheckIcon style={{ color: colors.validation.mint }} />
                  )}
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
