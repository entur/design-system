import { findGlobalStyleConflicts } from '../utils/warnAboutGlobalStyles';

const addStyle = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
  return style;
};

describe('findGlobalStyleConflicts', () => {
  afterEach(() => {
    document.head.innerHTML = '';
  });

  test('finds nothing when the beta styles are not loaded', () => {
    addStyle('h2 { font-size: 40px; }');
    expect(findGlobalStyleConflicts()).toEqual([]);
  });

  test('names the element rule and the component it overrides', () => {
    addStyle(`
      .eds-text-container { display: flow-root; }
      .eds-text-container > * + * { margin-top: 24px; }
      .eds-heading { font-size: 20px; font-weight: 500; }
      .eds-text--unordered-list { list-style-type: none; }
      .eds-text--code { font-family: monospace; }
      h2 { font-size: 40px; }
    `);
    expect(findGlobalStyleConflicts()).toEqual([
      '`h2 { font-size }` overrides Heading.',
    ]);
  });

  test('reports a TextContainer without gaps', () => {
    addStyle('.eds-text-container { display: flow-root; } * { margin: 0; }');
    expect(findGlobalStyleConflicts()).toContain(
      'TextContainer has no space between texts. Often a reset like `* { margin: 0 }`.',
    );
  });

  test('removes the probe elements', () => {
    findGlobalStyleConflicts();
    expect(document.body.innerHTML).toBe('');
  });
});
