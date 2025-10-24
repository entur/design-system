import React from 'react';
import classNames from 'classnames';
import { useSegmentedContext } from './SegmentedControl';
import { PolymorphicComponentPropsWithRef, PolymorphicRef } from '@entur/utils';

import './SegmentedChoice.scss';

export type SegmentedChoiceOwnProps = {
  /** Verdien til valget */
  value: string;
  /** Innhold som beskriver valget */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Callback for når valget endres */
  onChange?: (value: string) => void;
};

export type SegmentedChoiceProps<T extends React.ElementType> =
  PolymorphicComponentPropsWithRef<T, SegmentedChoiceOwnProps>;

export type SegmentedChoiceComponent = <
  T extends React.ElementType = typeof defaultElement,
>(
  props: SegmentedChoiceProps<T>,
) => React.ReactElement | null;

const defaultElement = 'button';

export const SegmentedChoice: SegmentedChoiceComponent = React.forwardRef<
  HTMLElement,
  SegmentedChoiceProps<React.ElementType>
>(function SegmentedChoice<E extends React.ElementType = typeof defaultElement>(
  {
    children,
    className,
    style,
    value,
    as,
    onChange,
    'data-first-child': isFirstChild,
    ...rest
  }: SegmentedChoiceProps<E>,
  ref?: PolymorphicRef<E>,
): React.ReactElement | null {
  const Element: React.ElementType = as || defaultElement;

  const {
    value: selectedValue,
    onChange: contextOnChange,
    size,
    focusedValue,
    setFocusedValue,
  } = useSegmentedContext();

  const isChecked = selectedValue === value;

  const tabIndex = React.useMemo(() => {
    if (selectedValue !== null) return isChecked ? 0 : -1;
    return isFirstChild ? 0 : -1;
  }, [isChecked, selectedValue, isFirstChild]);

  const handleSelection = () => {
    contextOnChange(value);
    onChange?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp': {
        e.preventDefault();
        const prevSibling = e.currentTarget.previousElementSibling;
        if (prevSibling && prevSibling instanceof HTMLElement) {
          prevSibling.focus();
          setFocusedValue(prevSibling.getAttribute('data-value') || null);
        }
        break;
      }
      case 'ArrowRight':
      case 'ArrowDown': {
        e.preventDefault();
        const nextSibling = e.currentTarget.nextElementSibling;
        if (nextSibling && nextSibling instanceof HTMLElement) {
          nextSibling.focus();
          setFocusedValue(nextSibling.getAttribute('data-value') || null);
        }
        break;
      }
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
          handleSelection();
          const linkElement = e.currentTarget as HTMLAnchorElement;
          if (linkElement.href) {
            // Delay click until state update is complete
            queueMicrotask(() => {
              linkElement.click();
            });
          }
        } else {
          handleSelection();
        }
        break;
      case 'Enter':
        handleSelection();
        break;
      case 'Escape':
        e.preventDefault();
        setFocusedValue(null);
        break;
    }
  };

  const onFocus = React.useCallback(() => {
    setFocusedValue(value);
  }, [setFocusedValue, value]);

  const onBlur = React.useCallback(() => {
    if (focusedValue === value) {
      setFocusedValue(null);
    }
  }, [focusedValue, value, setFocusedValue]);

  const elementProps = {
    className: classNames(
      'eds-segmented-choice',
      {
        'eds-segmented-choice--large': size === 'large',
      },
      className,
    ),
    style: style,
    'aria-checked': isChecked,
    'data-value': value,
    ref: ref,
    tabIndex: tabIndex,
    onClick: handleSelection,
    onKeyDown: handleKeyDown,
    onFocus: onFocus,
    onBlur: onBlur,
    role: 'radio',

    // For defaultElement button we override type submit
    ...(as === undefined && { type: 'button' }),
    ...rest,
  };

  return <Element {...elementProps}>{children}</Element>;
});
