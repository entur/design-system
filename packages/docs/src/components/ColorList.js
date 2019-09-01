import React from 'react';
import './ColorList.scss';

const camelCaseToKebabCase = str =>
  str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

export default function ColorList(props) {
  return (
    <ul className="color-list">
      {Object.entries(props.colors).map(([name, hex]) => (
        <li className="color-list__item" style={{ backgroundColor: hex }}>
          <div className="color-list__detail">
            {name}: {hex}
            <br />
            --{props.category}-{camelCaseToKebabCase(name)}
          </div>
        </li>
      ))}
    </ul>
  );
}
