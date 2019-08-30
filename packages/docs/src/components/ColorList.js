import React from 'react';
import './ColorList.scss';

export default function ColorList(props) {
  return (
    <ul className="color-list">
      {Object.entries(props.colors).map(([name, hex]) => (
        <li className="color-list__item" style={{ backgroundColor: hex }}>
          {name}: {hex}
        </li>
      ))}
    </ul>
  );
}
