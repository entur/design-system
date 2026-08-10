import React from 'react';
import { render } from '@testing-library/react';
import { useFloatingRef } from '../useFloatingRef';

type FloatingRef = (node: HTMLElement | null) => void;

/**
 * The render loop this guards against needs real layout, so it cannot be
 * reproduced in jsdom. These tests pin the two properties that break the
 * cycle: the wrapper never forwards React's detach call, and it keeps a
 * stable identity so it does not trigger detaches of its own.
 */
describe('useFloatingRef', () => {
  const setFloating = jest.fn();
  let wrappers: FloatingRef[] = [];

  function Probe({ setElement = setFloating }: { setElement?: FloatingRef }) {
    const setFloatingMenu = useFloatingRef(setElement);
    wrappers.push(setFloatingMenu);
    return <ul ref={setFloatingMenu} />;
  }

  beforeEach(() => {
    setFloating.mockClear();
    wrappers = [];
  });

  test('forwards the element when the ref is attached', () => {
    const { container } = render(<Probe />);

    expect(setFloating).toHaveBeenCalledTimes(1);
    expect(setFloating).toHaveBeenCalledWith(container.querySelector('ul'));
  });

  test('never forwards null, so floating-ui does not set state on detach', () => {
    render(<Probe />);
    setFloating.mockClear();

    wrappers[0](null);

    expect(setFloating).not.toHaveBeenCalled();
  });

  test('keeps one identity even when the setter changes every render', () => {
    // A setter with a fresh identity per render is what the hook has to
    // absorb: hold `setElement` in the dep array instead and every render
    // returns a new callback, which is the detach React reacts to.
    const { rerender } = render(
      <Probe setElement={node => setFloating(node)} />,
    );
    rerender(<Probe setElement={node => setFloating(node)} />);
    rerender(<Probe setElement={node => setFloating(node)} />);

    expect(wrappers).toHaveLength(3);
    expect(new Set(wrappers).size).toBe(1);
  });

  test('forwards to the newest setter, so a stable identity is not a stale one', () => {
    const first = jest.fn();
    const second = jest.fn();

    const { container, rerender } = render(<Probe setElement={first} />);
    rerender(<Probe setElement={second} />);

    const menu = container.querySelector('ul') as HTMLElement;
    first.mockClear();
    wrappers[wrappers.length - 1](menu);

    expect(second).toHaveBeenCalledWith(menu);
    expect(first).not.toHaveBeenCalled();
  });
});
