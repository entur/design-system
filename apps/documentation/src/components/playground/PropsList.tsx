import React from 'react';
import { Dropdown } from '@entur/dropdown';
import {
  Switch,
  TextField,
  SegmentedControl,
  SegmentedChoice,
} from '@entur/form';
import { AdvancedProps, capitalize } from './playground-utils';

export const PropsList = ({
  propsState,
  updatePropState,
}: {
  propsState: AdvancedProps[];
  updatePropState: (name: string, value: string | boolean) => void;
}) => {
  return (
    <>
      {propsState.map(prop => (
        <PropsController
          key={prop.name + prop.value}
          propState={prop}
          updatePropState={updatePropState}
        />
      ))}
    </>
  );
};

type PropsControllerProps = {
  propState: AdvancedProps;
  updatePropState: (name: string, value: string | boolean) => void;
};

const PropsController = ({
  propState,
  updatePropState,
}: PropsControllerProps) => {
  switch (propState.type) {
    case 'dropdown':
    case 'icon':
      return (
        <Dropdown
          label={propState.label ?? capitalize(propState.name)}
          items={propState.options ?? ['-mangler valg-']}
          value={propState.value as string}
          onChange={e => updatePropState(propState.name, e ? e.value : '')}
        />
      );
    case 'string':
      return (
        <TextField
          label={propState.label}
          value={propState.value as string}
          onChange={e => updatePropState(propState.name, e.target.value)}
        />
      );
    case 'boolean':
      return (
        <Switch
          checked={propState.value as boolean}
          onChange={e => updatePropState(propState.name, e.target.checked)}
        >
          <div className="eds-advanced__switch-label">{propState.label}</div>
        </Switch>
      );
    case 'segmented':
      return (
        <SegmentedControl
          label={propState.label}
          selectedValue={propState.value as string}
          onChange={selectedValue =>
            updatePropState(propState.name, selectedValue as string)
          }
        >
          {propState.options?.map(option => (
            <SegmentedChoice key={option + propState.label} value={option}>
              {option}
            </SegmentedChoice>
          ))}
        </SegmentedControl>
      );
    default:
      return <></>;
  }
};
