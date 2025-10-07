import React from 'react';
import classNames from 'classnames';
import { useSegmentedContext } from './SegmentedContext';
import { PolymorphicComponentProps } from '@entur/utils';
import './SegmentedChoice.scss';

export type SegmentedChoiceOwnProps = {
  /** Verdien til valget */
  value: string;
  /** Innhold som beskriver valget */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Callback som kalles når komponenten endres */
  onChange?: (value: string) => void;
};

export type SegmentedChoiceProps<T extends React.ElementType> =
  PolymorphicComponentProps<T, SegmentedChoiceOwnProps>;

const defaultElement = 'button';

export const SegmentedChoice = <
  E extends React.ElementType = typeof defaultElement,
>({
  children,
  className,
  style,
  value,
  as,
  onChange,
  ...rest
}: SegmentedChoiceProps<E>): JSX.Element => {
  const {
    selectedValue,
    onChange: commonOnChange,
    multiple,
    size,
    focusedValue,
    setFocusedValue,
  } = useSegmentedContext();

  const isChecked = multiple ? selectedValue[value] : selectedValue === value;
  const isFocused = focusedValue === value;

  // Use custom element if provided, otherwise use default button
  const Element: React.ElementType = as || defaultElement;

  // Calculate tabIndex for roving tabindex pattern
  const getTabIndex = () => {
    if (multiple) {
      // In multiple mode, make the first selected item tabbable, or first item if none selected
      const hasSelected = Object.values(selectedValue).some(Boolean);
      if (hasSelected) {
        return isChecked ? 0 : -1;
      } else {
        // If no items selected, make the first item tabbable
        // We'll determine this in the JSX using a ref
        return -1; // Will be overridden by ref logic
      }
    } else {
      // In single mode, make the selected item tabbable, or first item if none selected
      if (selectedValue) {
        return isChecked ? 0 : -1;
      } else {
        // If no item selected, make the first item tabbable
        // We'll determine this in the JSX using a ref
        return -1; // Will be overridden by ref logic
      }
    }
  };

  // Ref to check if this is the first element
  const elementRef = React.useRef<HTMLElement>(null);
  const [isFirstElement, setIsFirstElement] = React.useState(false);

  // Check if this is the first element after DOM updates
  React.useEffect(() => {
    if (!elementRef.current) return;

    const parent = elementRef.current.parentElement;
    if (!parent) return;

    const allChoices = Array.from(parent.children).filter(child =>
      child.classList.contains('eds-segmented-choice'),
    );

    const isFirst = allChoices[0] === elementRef.current;
    setIsFirstElement(isFirst);
  }, []);

  // Calculate final tabIndex
  const finalTabIndex = React.useMemo(() => {
    // If there's a selection, make the selected item tabbable
    if (multiple) {
      const hasSelected = Object.values(selectedValue).some(Boolean);
      if (hasSelected) {
        return isChecked ? 0 : -1;
      }
    } else {
      if (selectedValue) {
        return isChecked ? 0 : -1;
      }
    }

    // If no selection, make the first element tabbable
    return isFirstElement ? 0 : -1;
  }, [multiple, selectedValue, isChecked, isFirstElement]);

  const handleClick = () => {
    if (multiple) {
      commonOnChange({
        ...selectedValue,
        [value]: !selectedValue[value],
      } as any);
    } else {
      commonOnChange(value as any);
    }
    onChange?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        // Find previous sibling and focus it
        const prevSibling = e.currentTarget.previousElementSibling;
        if (prevSibling && prevSibling instanceof HTMLElement) {
          prevSibling.focus();
          setFocusedValue(prevSibling.getAttribute('data-value') || null);
        }
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        // Find next sibling and focus it
        const nextSibling = e.currentTarget.nextElementSibling;
        if (nextSibling && nextSibling instanceof HTMLElement) {
          nextSibling.focus();
          setFocusedValue(nextSibling.getAttribute('data-value') || null);
        }
        break;
      case 'Home': {
        e.preventDefault();
        const firstSibling = e.currentTarget.parentElement?.firstElementChild;
        if (firstSibling && firstSibling instanceof HTMLElement) {
          firstSibling.focus();
          setFocusedValue(firstSibling.getAttribute('data-value') || null);
        }
        break;
      }
      case 'End': {
        e.preventDefault();
        const lastSibling = e.currentTarget.parentElement?.lastElementChild;
        if (lastSibling && lastSibling instanceof HTMLElement) {
          lastSibling.focus();
          setFocusedValue(lastSibling.getAttribute('data-value') || null);
        }
        break;
      }
      case ' ':
        e.preventDefault();
        if (as === 'a') {
          handleClick();
          const linkElement = e.currentTarget as HTMLAnchorElement;
          if (linkElement.href) {
            // Delay click untill next tick
            setTimeout(() => {
              linkElement.click();
            }, 0);
          }
        } else {
          // For buttons, just handle the click normally
          handleClick();
        }
        break;
      case 'Enter':
        handleClick();
        break;
      case 'Escape':
        e.preventDefault();
        setFocusedValue(null);
        break;
    }
  };

  const handleFocus = () => {
    setFocusedValue(value);
  };

  const handleBlur = () => {
    if (focusedValue === value) {
      setFocusedValue(null);
    }
  };

  // Prepare props based on element type
  const elementProps = {
    className: classNames(
      'eds-segmented-choice',
      'eds-base-segmented',
      {
        'eds-base-segmented--large': size === 'large',
        'eds-base-segmented--focused': isFocused,
      },
      className,
    ),
    style: style,
    'aria-checked': isChecked,
    'data-value': value,
    ref: elementRef,
    tabIndex: finalTabIndex,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
    role: 'radio',

    ...(as === undefined && { type: 'button' }),
    ...rest,
  };

  return <Element {...elementProps}>{children}</Element>;
};
