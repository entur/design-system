import React, { useEffect } from 'react';
import { Dropdown } from '@entur/dropdown';
import {
  Switch,
  TextField,
  SegmentedControl,
  SegmentedChoice,
} from '@entur/form';

type ControllerProps = {
  name: string;
  label: string;
  value: string;
  setPlaygroundState: (name: string, item: string) => void;
};

type DropdownControllerProps = {
  items: string[];
};
export const DropdownController = ({
  name,
  label,
  items,
  value,
  setPlaygroundState,
}: ControllerProps & DropdownControllerProps) => {
  const [item, setItem] = React.useState<string | null>(value);
  React.useEffect(() => {
    setPlaygroundState(name, item);
  }, [item]);
  return (
    <Dropdown
      label={label}
      items={items}
      value={item}
      onChange={e => setItem(e ? e.value : null)}
    ></Dropdown>
  );
};

export const SwitchController = ({
  name,
  label,
  value,
  setPlaygroundState,
}: ControllerProps) => {
  const [checked, setChecked] = React.useState(value);

  React.useEffect(() => {
    setPlaygroundState(name, checked);
  }, [checked]);

  return (
    <Switch
      value={checked}
      checked={checked}
      onChange={e => setChecked(e.target.checked)}
    >
      <div className="eds-advanced__switch-label">{label}</div>
    </Switch>
  );
};

export const TextController = ({
  name,
  label,
  value,
  setPlaygroundState,
}: ControllerProps) => {
  const [state, setState] = React.useState(value);
  React.useEffect(() => {
    setPlaygroundState(name, state);
  }, [state]);
  return (
    <TextField
      label={label}
      value={state}
      onChange={e => setState(e.target.value)}
    ></TextField>
  );
};

type SegmentedControllerProps = {
  options: string[];
};

export const SegmentedController = ({
  name,
  label,
  value,
  options,
  setPlaygroundState,
}: ControllerProps & SegmentedControllerProps) => {
  const [state, setstate] = React.useState(value);
  React.useEffect(() => {
    setPlaygroundState(name, state);
  }, [state]);
  return (
    <SegmentedControl
      label={label}
      onChange={selectedValue => setstate(selectedValue)}
      selectedValue={state}
    >
      {options.map(option => (
        <SegmentedChoice key={option + label} value={option}>
          {option}
        </SegmentedChoice>
      ))}
    </SegmentedControl>
  );
};

type BooleanVariant = {
  name: string;
  defaultValue: true | false;
  type: 'boolean';
  label?: string;
};

type MultiVariant = {
  name: string;
  options: string[];
  defaultValue: string;
  type: 'dropdown' | 'segmented';
  label?: string;
};
type StringVariant = {
  name: string;
  defaultValue: string;
  type: 'string';
  label?: string;
};

type IconVariant = {
  name: string;
  type: 'icon';
  label?: string;
  defaultValue: 'AdjustmentsIcon';
  options: ['AdjustmentsIcon', 'BellIcon', 'DestinationIcon'];
};

export type AdvancedProps =
  | BooleanVariant
  | MultiVariant
  | StringVariant
  | IconVariant;

export const PropsList = ({ props, handleChange }) => {
  return (
    <>
      {props.map(p => {
        if (p.type === 'string') {
          return (
            <TextController
              key={p.name}
              name={p.name}
              label={p.label ? p.label : p.name}
              value={p.defaultValue}
              setPlaygroundState={handleChange}
            />
          );
        } else if (p.type === 'boolean') {
          return (
            <SwitchController
              key={p.name}
              name={p.name}
              label={p.label ? p.label : capitalize(p.name)}
              value={p.defaultValue}
              setPlaygroundState={handleChange}
            />
          );
        } else if (p.type === 'dropdown') {
          return (
            <DropdownController
              key={p.name}
              name={p.name}
              items={p.options}
              label={p.label ? p.label : capitalize(p.name)}
              value={p.defaultValue}
              setPlaygroundState={handleChange}
            />
          );
        } else if (p.type === 'segmented') {
          return (
            <SegmentedController
              key={p.name}
              name={p.name}
              options={p.options}
              value={p.defaultValue}
              label={p.label ? p.label : capitalize(p.name)}
              setPlaygroundState={handleChange}
            />
          );
        } else if (p.type === 'icon') {
          return (
            <DropdownController
              key={p.name}
              name={p.name}
              items={p.options}
              label={p.label ? p.label : capitalize(p.name)}
              value={p.defaultValue}
              setPlaygroundState={handleChange}
            />
          );
        } else {
          return <></>;
        }
      })}
    </>
  );
};

function capitalize(s: string) {
  return s && s[0].toUpperCase() + s.slice(1);
}

export const useAdvancedPlaygroundCode = (
  __code: any,
  props: AdvancedProps[],
) => {
  const [code, setCode] = React.useState<string>(__code);
  const [propState, setPropState] = React.useState(
    props.map(p => {
      const name = p.name;
      const df = p.defaultValue;
      return { [name]: df };
    }),
  );

  const componentName = /([A-Z][a-z]+)+/.exec(__code)[0];

  const handleChange = (name: string, value: string | boolean) => {
    const prevState = propState;
    setPropState(
      prevState.map(prev => {
        return Object.keys(prev)[0] === name ? { [name]: value } : prev;
      }),
    );
  };

  useEffect(() => {
    const FormatChildren = (code: string) => {
      const childrenContent = propState.find(prop => prop['children']);

      if (childrenContent) {
        // Regex for alle typer innhold til children
        const childrenRegex = new RegExp(`>(?!})(([\\W\\w\\s])+)?<`);
        // console.log(childrenRegex.exec(code));

        return code.replace(
          childrenRegex,
          `>${childrenContent?.children ? childrenContent.children : ''}<`,
        );
      } else {
        return code;
      }
    };
    const componentPropsPattern = `<([A-Z][a-z]+)+(\\s?>|\\s[\\s\\S]*?>(?!}))`;
    const componentPropsRegex = new RegExp(componentPropsPattern);
    const propString = Object.entries(props)
      .reduce((accumulator, [, value]) => {
        if (value.name === 'children') {
          return accumulator;
        }
        const thisone = propState.find(prop => {
          return prop[value.name];
        });

        if (value.type === 'icon' && thisone !== undefined) {
          return `${accumulator} ${value.name}={<${thisone[value.name]}/>}`;
        }
        if (value.type === 'boolean' && thisone !== undefined) {
          return `${accumulator} ${value.name}`;
        }
        if (thisone !== undefined) {
          return `${accumulator} ${value.name}="${thisone[value.name]}"`;
        }
        return accumulator;
      }, '')
      .concat('');

    setCode(prev => {
      const codeWithProps = prev.replace(
        componentPropsRegex,
        `<${componentName}${propString}>`,
      );
      return FormatChildren(codeWithProps);
    });
  }, [propState]);

  return { code, setCode, handleChange };
};
