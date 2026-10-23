import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Text } from '..';
import { describeComponentContract } from '../../../../../tests/jest/componentContract';

describeComponentContract('Text', {
  render: props => <Text {...props}>Content</Text>,
  getElement: () => screen.getByText('Content'),
  baseClassName: 'eds-text',
  as: 'div',
});

test('composes paragraph, inline emphasis and preformatted code semantics', () => {
  const code = 'route:\n  Oslo -> Bergen';
  render(
    <>
      <Text>
        Bring{' '}
        <Text as="em" variant="emphasized">
          your ticket
        </Text>
        . <Text variant="caption">Valid today</Text>
      </Text>
      <Text variant="preformatted-text">
        <Text variant="code-text">{code}</Text>
      </Text>
    </>,
  );

  const emphasis = screen.getByText('your ticket');
  expect(emphasis.tagName).toBe('EM');
  expect(emphasis.parentElement?.tagName).toBe('P');
  const caption = screen.getByText('Valid today');
  expect(caption.tagName).toBe('SPAN');
  expect(caption.parentElement).toBe(emphasis.parentElement);
  const codeElement = screen.getByText('route: Oslo -> Bergen');
  expect(codeElement.tagName).toBe('CODE');
  expect(codeElement.parentElement?.tagName).toBe('PRE');
  expect(codeElement.textContent).toBe(code);
});

test('associates a label and supporting text with an editable control', async () => {
  const user = userEvent.setup();
  render(
    <>
      <Text variant="label">
        Destination
        <input aria-describedby="destination-help" />
      </Text>
      <Text variant="sublabel" id="destination-help">
        Choose a station
      </Text>
    </>,
  );

  const input = screen.getByRole('textbox', { name: 'Destination' });
  expect(input).toHaveAccessibleDescription('Choose a station');
  await user.click(screen.getByText('Destination'));
  expect(input).toHaveFocus();
  await user.keyboard('Oslo');
  expect(input).toHaveValue('Oslo');
});

test('clears existing text when children become empty, null or undefined', () => {
  const { container, rerender } = render(<Text>Initial text</Text>);
  const paragraph = screen.getByText('Initial text');

  for (const children of ['', null, undefined]) {
    rerender(<Text>Updated text</Text>);
    expect(paragraph).toHaveTextContent('Updated text');
    rerender(<Text>{children}</Text>);
    expect(container.firstChild).toBe(paragraph);
    expect(paragraph).toBeEmptyDOMElement();
  }
});

test.each([
  [undefined, 'P'],
  ['paragraph', 'P'],
  ['leading', 'P'],
  ['label', 'LABEL'],
  ['sublabel', 'SPAN'],
  ['caption', 'SPAN'],
  ['overline', 'SPAN'],
  ['link', 'A'],
  ['code-text', 'CODE'],
  ['preformatted-text', 'PRE'],
  ['quote', 'BLOCKQUOTE'],
] as const)('renders the %s variant as <%s>', (variant, tagName) => {
  render(<Text variant={variant}>Content</Text>);
  expect(screen.getByText('Content').tagName).toBe(tagName);
});

test('applies variant, size, weight and spacing modifiers', () => {
  render(
    <Text variant="paragraph" size="m" weight="medium" spacing="sm">
      Content
    </Text>,
  );
  expect(screen.getByText('Content')).toHaveClass(
    'eds-text--paragraph',
    'eds-text--m',
    'eds-text--weight-medium',
    'eds-text--spacing-sm',
  );
});

test('adds only the base class without modifier props', () => {
  render(<Text>Content</Text>);
  expect(screen.getByText('Content')).toHaveAttribute('class', 'eds-text');
});
