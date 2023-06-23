import React from 'react';
import Downshift, {
  ControllerStateAndHelpers,
  DownshiftState,
  StateChangeOptions,
} from 'downshift';
import { NormalizedDropdownItemType } from './beta/useNormalizedItems';
import classNames from 'classnames';

const DownshiftContext =
  React.createContext<ControllerStateAndHelpers<NormalizedDropdownItemType> | null>(
    null,
  );

export type DownshiftProviderProps = {
  onChange?: (
    selectedItem: NormalizedDropdownItemType,
    stateAndHelpers: ControllerStateAndHelpers<NormalizedDropdownItemType>,
  ) => void;
  onInputValueChange?: (value: string) => void;
  inputValue?: string;
  initialSelectedItem?: NormalizedDropdownItemType;
  highlightFirstItemOnOpen?: boolean;
  className?: string;
  style?: React.CSSProperties;
  searchable?: boolean;
  [key: string]: any;
};
export const DownshiftProvider: React.FC<DownshiftProviderProps> = ({
  children,
  onChange = () => undefined,
  onInputValueChange = () => undefined,
  highlightFirstItemOnOpen = false,
  className,
  style,
  searchable = false,
  ...rest
}) => {
  const handleStateChange = (
    changes: any,
    stateAndHelpers: ControllerStateAndHelpers<NormalizedDropdownItemType>,
  ) => {
    if (
      changes.type ===
      Downshift.stateChangeTypes.controlledPropUpdatedSelectedItem
    ) {
      return;
    }
    if ('selectedItem' in changes) {
      onChange(changes.selectedItem, stateAndHelpers);
    } else if ('inputValue' in changes) {
      onInputValueChange(changes.inputValue);
    }
  };

  const stateReducer = (
    _: DownshiftState<NormalizedDropdownItemType>,
    changes: StateChangeOptions<NormalizedDropdownItemType>,
  ): Partial<StateChangeOptions<NormalizedDropdownItemType>> => {
    const highlightFirstOnOpen =
      highlightFirstItemOnOpen && 'isOpen' in changes && changes.isOpen;
    const highlightFirstItemIndex: Partial<
      StateChangeOptions<NormalizedDropdownItemType>
    > = highlightFirstOnOpen ? { highlightedIndex: 0 } : {};

    if (searchable) {
      const { type } = changes;

      switch (type) {
        case '__autocomplete_change_input__':
          return {
            // return normal changes.
            ...changes,
            ...highlightFirstItemIndex,
          };
        case '__autocomplete_click_item__':
        case '__autocomplete_keydown_enter__':
        case '__autocomplete_blur_input__':
        case '__autocomplete_mouseup__':
          return {
            ...changes,
            // if we had an item highlighted in the previous state.
            // we will reset input field value to blank
            inputValue: '',
            ...highlightFirstItemIndex,
          };
        default:
          return {
            ...changes,
            ...highlightFirstItemIndex,
          };
      }
    } else {
      return { ...changes, ...highlightFirstItemIndex };
    }
  };

  return (
    <Downshift
      itemToString={item => (item ? item.label : '')}
      onStateChange={handleStateChange}
      stateReducer={stateReducer}
      {...rest}
    >
      {args => (
        <div className={classNames('eds-input-group', className)} style={style}>
          {/* This div is required by Downshift */}
          <DownshiftContext.Provider value={args}>
            {children}
          </DownshiftContext.Provider>
        </div>
      )}
    </Downshift>
  );
};

export const useDownshift: () => ControllerStateAndHelpers<NormalizedDropdownItemType> =
  () => {
    const context = React.useContext(DownshiftContext);
    if (!context) {
      throw new Error('You need to wrap your component in a DownshiftProvider');
    }
    return context;
  };
