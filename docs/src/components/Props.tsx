import React from 'react';
import { PropsComponentProps } from 'docz';
import { Heading4 } from '@entur/typography';
import { CheckIcon } from '@entur/icons';
import { useSettings } from './SettingsContext';

import './Props.scss';

const Props: React.FC<PropsComponentProps> = ({ title = 'Props', props }) => {
  const { userType } = useSettings();
  return (
    <details open={userType === 'developer'}>
      <summary>
        <Heading4 as="h2" style={{ display: 'inline-block' }}>
          {title}
        </Heading4>
      </summary>
      <table className="entur-table entur-table--width-fluid">
        <thead>
          <tr className="entur-table__row">
            <th className="entur-table__header-cell">Navn</th>
            <th className="entur-table__header-cell">Type</th>
            <th className="entur-table__header-cell">Påkrevd?</th>
            <th className="entur-table__header-cell">Default-verdi</th>
            <th className="entur-table__header-cell">Beskrivelse</th>
          </tr>
        </thead>
        <tbody className="entur-table__body">
          {Object.entries(props).map(([propName, details]) => (
            <tr className="entur-table__row" key={propName}>
              <td className="entur-table__data-cell">{propName}</td>
              <td className="entur-table__data-cell">{details.type.name}</td>
              <td className="entur-table__data-cell entur-table__data-cell--align-center">
                {details.required && <CheckIcon />}
              </td>
              <td className="entur-table__data-cell">
                {details.defaultValue ? details.defaultValue.value : null}
              </td>
              <td className="entur-table__data-cell">{details.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
};

export default Props;
