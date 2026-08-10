import { getActiveElement } from './getActiveElement';

let host: HTMLDivElement;
let shadowRoot: ShadowRoot;

beforeEach(() => {
  host = document.createElement('div');
  document.body.appendChild(host);
  shadowRoot = host.attachShadow({ mode: 'open' });
});

afterEach(() => {
  document.body.removeChild(host);
});

describe('getActiveElement', () => {
  test('returns the focused element in the light DOM', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();

    expect(getActiveElement()).toBe(button);

    document.body.removeChild(button);
  });

  test('drills into a shadow root instead of stopping at the host', () => {
    const button = document.createElement('button');
    shadowRoot.appendChild(button);
    button.focus();

    expect(document.activeElement).toBe(host);
    expect(getActiveElement()).toBe(button);
  });

  test('drills into nested shadow roots', () => {
    const innerHost = document.createElement('div');
    shadowRoot.appendChild(innerHost);
    const button = document.createElement('button');
    innerHost.attachShadow({ mode: 'open' }).appendChild(button);
    button.focus();

    expect(getActiveElement()).toBe(button);
  });

  test('accepts an explicit root', () => {
    const button = document.createElement('button');
    shadowRoot.appendChild(button);
    button.focus();

    expect(getActiveElement(shadowRoot)).toBe(button);
  });
});
