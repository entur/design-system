import { Dropdown } from '@entur/dropdown';
import { BaseExpand } from '@entur/expand';
import {
  SegmentedChoice,
  SegmentedControl,
  Switch,
  TextField,
} from '@entur/form';
import {
  SourceCodeIcon,
  AdjustmentsIcon,
  BellIcon,
  DestinationIcon,
} from '@entur/icons';
import { BaseCard } from '@entur/layout';
import { Heading5 } from '@entur/typography';
import classNames from 'classnames';
import React from 'react';
import { LiveEditor, LivePreview, LiveProvider } from 'react-live';
import prismTheme from '~/components/prism-theme';
import './AdvancedPlayground.scss';

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

type AdvancedPlaygroundProps = {
  props: AdvancedProps[];
  [key: string]: any;
};

function capitalize(s: string) {
  return s && s[0].toUpperCase() + s.slice(1);
}

export const AdvancedPlayground: React.FC<AdvancedPlaygroundProps> = ({
  props,
  code: __code,
  scope,
  style,
}) => {
  const componentName = /([A-Z][a-z]+)+/.exec(__code)[0];

  const [isContrast, setContrast] = React.useState(false);
  const [code, setCode] = React.useState<string>(__code);
  const [showCode, setShowCode] = React.useState(false);
  const [propState, setPropState] = React.useState(
    props.map(p => {
      let name = p.name;
      let df = p.defaultValue;
      return { [name]: df };
    }),
  );

  const handleChange = (name, value) => {
    let prevState = propState;
    setPropState(
      prevState.map(prev => {
        return Object.keys(prev)[0] === name ? { [name]: value } : prev;
      }),
    );
  };

  React.useEffect(() => {
    const FormatChildren = (code: string) => {
      const childrenContent = propState.find(prop => prop['children']);

      if (childrenContent) {
        // Regex for alle typer innhold til children
        const childrenRegex = new RegExp(`>(?!\})(([\\W\\w\\s])+)?<`);
        // console.log(childrenRegex.exec(code));

        return code.replace(
          childrenRegex,
          `>${childrenContent?.children ? childrenContent.children : ''}<`,
        );
      } else {
        return code;
      }
    };
    // eslint-disable-next-line no-useless-escape
    const pattern = `<([A-Z][a-z]+)+(\\s?>|\\s[\\s\\S]*?>(?!}))`;
    const componentPropsRegex = new RegExp(pattern);
    const propString = Object.entries(props)
      .reduce((accumulator, [_, value]) => {
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

  const transformCode = (codeToTransform: string) => {
    if (codeToTransform.startsWith('()') || codeToTransform.startsWith('class'))
      return codeToTransform;
    return `<React.Fragment>${codeToTransform}</React.Fragment>`;
  };

  const icons = { AdjustmentsIcon, BellIcon, DestinationIcon };
  return (
    <LiveProvider
      scope={{ ...scope, ...icons }}
      code={code}
      transformCode={transformCode}
      theme={prismTheme}
    >
      <div className="eds-advanced__wrapper">
        <div
          className={classNames('eds-advanced__playground', {
            'eds-contrast': isContrast,
          })}
        >
          <LivePreview
            style={style}
            className="eds-advanced__playground-live-preview"
          ></LivePreview>
        </div>
        <Switch
          className={classNames('eds-advanced__contrast-switch', {
            'eds-contrast': isContrast,
          })}
          name="contrast"
          checked={isContrast}
          onChange={() => setContrast(prev => !prev)}
        >
          Contrast
        </Switch>
        <div className="eds-advanced__props">
          <Heading5 as="div" margin="bottom">
            Props
          </Heading5>
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
            }
          })}
        </div>
      </div>
      <div className="eds-advanced__show-code-wrapper">
        <BaseCard className="eds-advanced__show-code">
          <button
            className="eds-advanced__show-code-button"
            onClick={() => setShowCode(prev => !prev)}
          >
            <SourceCodeIcon /> Vis kode
          </button>
          <div style={{ width: '100%' }}>
            <BaseExpand open={showCode}>
              <LiveEditor
                className="eds-advanced__code"
                onChange={updatedCode => setCode(updatedCode)}
              ></LiveEditor>
            </BaseExpand>
          </div>
        </BaseCard>
      </div>
    </LiveProvider>
  );
};

type ControllerProps = {
  name: string;
  label: string;
  value: string;
  setPlaygroundState: (name: string, item: string) => void;
};

type DropdownControllerProps = {
  items: string[];
};
const DropdownController = ({
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

const SwitchController = ({
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

const TextController = ({
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

const SegmentedController = ({
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
