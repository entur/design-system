import React from 'react';
import { PropsComponentProps } from 'docz';
import { CodeText, Heading4 } from '@entur/typography';
import { CheckIcon } from '@entur/icons';
import { useSettings } from './SettingsContext';

import './Props.scss';

function skipUndefinedType(type: string) {
  return type.replace(/\| undefined/g, '');
}

const Props: React.FC<PropsComponentProps> = ({ title = 'Props', props }) => {
  const { userType } = useSettings();
  const hasAnyDefaultValues = Object.values(props).some(
    details => details.defaultValue,
  );
  return (
    <details open={userType === 'developer'}>
      <summary>
        <Heading4 as="h2" style={{ display: 'inline-block' }}>
          {title}
        </Heading4>
      </summary>
      <table className="entur-table entur-table--width-fluid entur-table--fixed">
        <thead>
          <tr className="entur-table__row">
            <th className="entur-table__header-cell">Navn</th>
            <th className="entur-table__header-cell">Type</th>
            <th className="entur-table__header-cell">Påkrevd?</th>
            {hasAnyDefaultValues && (
              <th className="entur-table__header-cell">Default-verdi</th>
            )}
            <th className="entur-table__header-cell">Beskrivelse</th>
          </tr>
        </thead>
        <tbody className="entur-table__body">
          {Object.entries(props).map(([propName, details]) => (
            <tr className="entur-table__row" key={propName}>
              <td className="entur-table__data-cell">
                <CodeText>{propName}</CodeText>
              </td>
              <td className="entur-table__data-cell">
                <CodeText>{skipUndefinedType(details.type.name)}</CodeText>
              </td>
              <td className="entur-table__data-cell">
                {details.required && <CheckIcon />}
              </td>
              {hasAnyDefaultValues && (
                <td className="entur-table__data-cell">
                  {details.defaultValue ? (
                    <CodeText>{String(details.defaultValue.value)}</CodeText>
                  ) : null}
                </td>
              )}
              <td className="entur-table__data-cell">{details.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
};

export default Props;
