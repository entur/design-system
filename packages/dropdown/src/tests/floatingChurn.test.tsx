import React from 'react';
import { render } from '@testing-library/react';

/**
 * The infinite render loop needs real layout and cannot be reproduced in
 * jsdom, but its precondition can: floating-ui's element setters must never
 * be called with null. Every detach sets floating-ui state, and a state
 * change triggers the render that causes the next detach.
 *
 * These tests fail if a component stops routing a setter through
 * useFloatingRef — the hook's own tests would still pass in that case.
 */

// The `mock` name prefix is what lets the jest.mock factory close over this
const mockCalls: { floating: unknown[]; reference: unknown[] } = {
  floating: [],
  reference: [],
};

jest.mock('@floating-ui/react-dom', () => {
  const actual = jest.requireActual('@floating-ui/react-dom');
  const ReactActual = jest.requireActual('react');
  return {
    ...actual,
    useFloating: (options: any) => {
      const result = actual.useFloating(options);
      const { setFloating: realFloating, setReference: realReference } =
        result.refs;
      // Stable, since floating-ui's own setters are — so the probe cannot
      // cause the churn it measures
      const setFloating = ReactActual.useCallback(
        (node: unknown) => {
          mockCalls.floating.push(node);
          realFloating(node);
        },
        [realFloating],
      );
      const setReference = ReactActual.useCallback(
        (node: unknown) => {
          mockCalls.reference.push(node);
          realReference(node);
        },
        [realReference],
      );
      return {
        ...result,
        refs: { ...result.refs, setFloating, setReference },
      };
    },
  };
});

import { Dropdown, MultiSelect, SearchableDropdown } from '..';

const items = ['Oslo', 'Bergen', 'Stavanger'];

// Count instead of asserting on the arrays: a failing matcher would print
// every DOM node it collected.
const detaches = (calls: unknown[]) => calls.filter(node => node === null);

describe('floating-ui element setters are never detached on re-render', () => {
  beforeEach(() => {
    mockCalls.floating = [];
    mockCalls.reference = [];
  });

  test('MultiSelect', () => {
    const { rerender } = render(
      <MultiSelect label="a" items={items} selectedItems={[]} />,
    );
    rerender(<MultiSelect label="b" items={items} selectedItems={[]} />);
    rerender(<MultiSelect label="c" items={items} selectedItems={[]} />);

    expect(mockCalls.floating.length).toBeGreaterThan(0);
    expect(mockCalls.reference.length).toBeGreaterThan(0);
    expect(detaches(mockCalls.floating)).toHaveLength(0);
    expect(detaches(mockCalls.reference)).toHaveLength(0);
  });

  test('SearchableDropdown', () => {
    const { rerender } = render(
      <SearchableDropdown label="a" items={items} selectedItem={null} />,
    );
    rerender(
      <SearchableDropdown label="b" items={items} selectedItem={null} />,
    );
    rerender(
      <SearchableDropdown label="c" items={items} selectedItem={null} />,
    );

    expect(mockCalls.floating.length).toBeGreaterThan(0);
    expect(mockCalls.reference.length).toBeGreaterThan(0);
    expect(detaches(mockCalls.floating)).toHaveLength(0);
    expect(detaches(mockCalls.reference)).toHaveLength(0);
  });

  test('Dropdown', () => {
    const { rerender } = render(
      <Dropdown label="a" items={items} selectedItem={null} />,
    );
    rerender(<Dropdown label="b" items={items} selectedItem={null} />);
    rerender(<Dropdown label="c" items={items} selectedItem={null} />);

    expect(mockCalls.floating.length).toBeGreaterThan(0);
    expect(mockCalls.reference.length).toBeGreaterThan(0);
    expect(detaches(mockCalls.floating)).toHaveLength(0);
    expect(detaches(mockCalls.reference)).toHaveLength(0);
  });
});
