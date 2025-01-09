import React from 'react';

import { AdvancedProps, capitalize } from './playground-utils';

import { Dropdown, NormalizedDropdownItemType } from '@entur/dropdown';
import {
  Switch,
  TextField,
  SegmentedControl,
  SegmentedChoice,
} from '@entur/form';

import './Playground.scss';

const PropsList = ({
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
          key={prop.name}
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
          selectedItem={
            {
              label: propState.value as string,
              value: propState.value as string,
            } as NormalizedDropdownItemType
          }
          onChange={selectedItem =>
            updatePropState(propState.name, selectedItem?.value ?? '')
          }
          className="playground__props-selector__prop"
        />
      );
    case 'string':
      return (
        <TextField
          label={propState.label}
          value={propState.value as string}
          onChange={e => updatePropState(propState.name, e.target.value)}
          className="playground__props-selector__prop"
        />
      );
    case 'boolean':
      return (
        <Switch
          checked={propState.value as boolean}
          onChange={e => updatePropState(propState.name, e.target.checked)}
        >
          {propState.label ?? capitalize(propState.name)}
        </Switch>
      );
    case 'segmented':
      return (
        <SegmentedControl
          label={propState.label ?? capitalize(propState.name)}
          selectedValue={propState.value as string}
          onChange={selectedValue =>
            updatePropState(propState.name, selectedValue as string)
          }
          className="playground__props-selector__prop"
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

export default PropsList;
