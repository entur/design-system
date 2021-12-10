import React from 'react';
import Downshift, {
  ControllerStateAndHelpers,
  DownshiftState,
  StateChangeOptions,
} from 'downshift';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import classNames from 'classnames';
enum StateChangeTypes {
  unknown = '__autocomplete_unknown__',
  mouseUp = '__autocomplete_mouseup__',
  itemMouseEnter = '__autocomplete_item_mouseenter__',
  keyDownArrowUp = '__autocomplete_keydown_arrow_up__',
  keyDownArrowDown = '__autocomplete_keydown_arrow_down__',
  keyDownEscape = '__autocomplete_keydown_escape__',
  keyDownEnter = '__autocomplete_keydown_enter__',
  clickItem = '__autocomplete_click_item__',
  blurInput = '__autocomplete_blur_input__',
  changeInput = '__autocomplete_change_input__',
  keyDownSpaceButton = '__autocomplete_keydown_space_button__',
  clickButton = '__autocomplete_click_button__',
  blurButton = '__autocomplete_blur_button__',
  controlledPropUpdatedSelectedItem = '__autocomplete_controlled_prop_updated_selected_item__',
  touchEnd = '__autocomplete_touchend__',
}
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
    // console.log(changes);

    if (
      changes.type ===
      Downshift.stateChangeTypes.controlledPropUpdatedSelectedItem
    ) {
      return;
    }
    if ('selectedItem' in changes) {
      onChange(changes.selectedItem, stateAndHelpers);
    } else if ('inputValue' in changes) {
      // onInputValueChange(changes.inputValue);
    }
  };

  const stateReducer = (
    state: DownshiftState<NormalizedDropdownItemType>,
    changes: StateChangeOptions<NormalizedDropdownItemType>,
  ): Partial<StateChangeOptions<NormalizedDropdownItemType>> => {
    if (highlightFirstItemOnOpen) {
      const wasJustOpened = 'isOpen' in changes && changes.isOpen;
      if (wasJustOpened) {
        return { ...changes, highlightedIndex: 0 };
      }
    }
    const { type } = changes;
    console.log(type);
    console.log(changes);

    switch (type) {
      case StateChangeTypes.changeInput:
        return {
          // return normal changes.
          ...changes,
        };
      // also on selection.
      case StateChangeTypes.clickItem:
      case StateChangeTypes.keyDownEnter:
      case StateChangeTypes.blurInput:
      case StateChangeTypes.mouseUp:
        // onSelectExtraActions(changes.selectedItem);
        return {
          ...changes,
          // if we had an item highlighted in the previous state.
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          ...(state.highlightedIndex > -1 && {
            // we will reset input field value to blank
            inputValue: '',
          }),
        };
      default:
        return changes; // otherwise business as usual.
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
