import React from 'react';
import './ColorList.scss';

const camelCaseToKebabCase = (str: string) =>
  str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

interface IProps {
  colors: {
    [name: string]: string;
  };
  category: string;
}
export default function ColorList(props: IProps) {
  return (
    <ul className="color-list">
      {Object.entries(props.colors).map(([name, hex]) => (
        <li
          className="color-list__item"
          style={{ backgroundColor: hex }}
          key={hex + name}
        >
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
