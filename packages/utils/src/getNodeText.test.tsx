import { getNodeText } from '.';

test('extracts a menu label from fragments, nested elements, arrays and zero', () => {
  expect(
    getNodeText(
      <>
        <strong>Platform</strong> <span>{[0, null, undefined]}</span>
      </>,
    ),
  ).toBe('Platform 0');
});

// Bug: getNodeText trims nested arrays before joining them, removing word separators.
test.failing('preserves separating whitespace in nested child arrays', () => {
  expect(
    getNodeText(
      <>
        <strong>Platform</strong>
        {[' ', <span key="number">{0}</span>, null, undefined]}
      </>,
    ),
  ).toBe('Platform 0');
});

// Bug: getNodeText converts boolean children to "unknown" instead of omitting them.
test.failing(
  'omits boolean children from conditionally rendered menu labels',
  () => {
    const showIcon = false;
    expect(
      getNodeText(
        <>
          {showIcon && <span>Icon</span>}
          <span>Departures</span>
        </>,
      ),
    ).toBe('Departures');
  },
);
