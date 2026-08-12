import React, { useRef } from 'react';
import { render, renderHook } from '@testing-library/react';
import { useShadowDomEnvironment } from '../useShadowDomEnvironment';

function createShadowDomContainer() {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const shadowRoot = host.attachShadow({ mode: 'open' });
  const container = document.createElement('div');
  shadowRoot.appendChild(container);
  return { host, container };
}

let host: HTMLDivElement;
let container: HTMLDivElement;

beforeEach(() => {
  ({ host, container } = createShadowDomContainer());
});

afterEach(() => {
  document.body.removeChild(host);
});

describe('environment.document proxy', () => {
  function environmentDocument() {
    const el = document.createElement('div');
    container.appendChild(el);
    const ref = { current: el };
    const { result } = renderHook(() => useShadowDomEnvironment(ref));
    return result.current!.document;
  }

  test.each(['body', 'documentElement', 'head'] as const)(
    'invokes the getter for %s with the real document as receiver',
    prop => {
      // Accessors on Document.prototype are branded: browsers throw
      // "Illegal invocation" if the getter runs with `this` set to
      // anything but a real Document — the proxy included. jsdom does
      // not brand-check, so assert the receiver directly.
      const descriptor = Object.getOwnPropertyDescriptor(
        Document.prototype,
        prop,
      )!;
      const expected = document[prop];
      const receivers: unknown[] = [];
      Object.defineProperty(Document.prototype, prop, {
        ...descriptor,
        get() {
          receivers.push(this);
          return descriptor.get!.call(document);
        },
      });

      let actual;
      try {
        actual = environmentDocument()[prop];
      } finally {
        Object.defineProperty(Document.prototype, prop, descriptor);
      }

      expect(actual).toBe(expected);
      expect(receivers.length).toBeGreaterThan(0);
      // Compared as a boolean: printing a diff of the proxied document
      // exhausts memory in jest's matcher utils.
      expect(receivers.every(candidate => candidate === document)).toBe(true);
    },
  );

  test('lets downshift append to document.body', () => {
    const doc = environmentDocument();
    const div = doc.createElement('div');
    expect(() => doc.body.appendChild(div)).not.toThrow();
    doc.body.removeChild(div);
  });

  test('activeElement is never null when focus is outside the shadow root', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);
    outside.focus();

    expect(environmentDocument().activeElement).toBe(outside);

    document.body.removeChild(outside);
  });

  test('activeElement drills into the shadow root when focus is inside', () => {
    const inside = document.createElement('button');
    container.appendChild(inside);
    inside.focus();

    expect(environmentDocument().activeElement).toBe(inside);
  });
});

describe('useShadowDomEnvironment outside shadow DOM', () => {
  test('returns undefined so downshift uses its window default', () => {
    let environment: ReturnType<typeof useShadowDomEnvironment>;
    function Probe() {
      const ref = useRef<HTMLDivElement>(null);
      environment = useShadowDomEnvironment(ref);
      return <div ref={ref} />;
    }
    render(<Probe />);
    expect(environment!).toBeUndefined();
  });
});
