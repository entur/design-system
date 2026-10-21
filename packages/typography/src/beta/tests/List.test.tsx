import { render, screen, within } from '@testing-library/react';
import { ListItem, NumberedList, UnorderedList } from '..';
import { describeComponentContract } from '../../../../../tests/jest/componentContract';

describeComponentContract('NumberedList', {
  render: props => (
    <NumberedList {...props}>
      <ListItem>Content</ListItem>
    </NumberedList>
  ),
  getElement: () => screen.getByRole('list'),
  baseClassName: 'eds-text--numbered-list',
  as: 'ul',
});

describeComponentContract('UnorderedList', {
  render: props => (
    <UnorderedList {...props}>
      <ListItem>Content</ListItem>
    </UnorderedList>
  ),
  getElement: () => screen.getByRole('list'),
  baseClassName: 'eds-text--unordered-list',
  as: 'ol',
});

describeComponentContract('ListItem', {
  render: props => <ListItem {...props}>Content</ListItem>,
  getElement: () => screen.getByText('Content'),
  baseClassName: 'eds-text--list-item',
  as: 'div',
});

test('composes ordered and unordered lists with visible item titles', () => {
  render(
    <>
      <NumberedList aria-label="Booking steps" start={3} type="A">
        <ListItem title="Choose a route">Find your destination</ListItem>
        <ListItem>Pay for tickets</ListItem>
      </NumberedList>
      <UnorderedList aria-label="Bring on board">
        <ListItem>Your ticket</ListItem>
      </UnorderedList>
    </>,
  );

  const ordered = screen.getByRole('list', { name: 'Booking steps' });
  expect(ordered.tagName).toBe('OL');
  expect(ordered).toHaveAttribute('start', '3');
  expect(ordered).toHaveAttribute('type', 'A');
  const items = within(ordered).getAllByRole('listitem');
  expect(items).toHaveLength(2);
  expect(items[0]).toHaveTextContent('Choose a route');
  expect(items[0]).toHaveTextContent('Find your destination');
  expect(items[1]).toHaveTextContent('Pay for tickets');
  const unordered = screen.getByRole('list', { name: 'Bring on board' });
  expect(unordered.tagName).toBe('UL');
  expect(within(unordered).getAllByRole('listitem')).toHaveLength(1);
});

test('applies the numbered list type modifier, defaulting to 1', () => {
  const { rerender } = render(
    <NumberedList>
      <ListItem>Content</ListItem>
    </NumberedList>,
  );
  const list = screen.getByRole('list');
  expect(list).toHaveClass('eds-text--numbered-list--type-1');
  rerender(
    <NumberedList type="i">
      <ListItem>Content</ListItem>
    </NumberedList>,
  );
  expect(list).toHaveClass('eds-text--numbered-list--type-i');
  expect(list).not.toHaveClass('eds-text--numbered-list--type-1');
});

test('applies spacing modifiers to lists and items', () => {
  render(
    <UnorderedList spacing="md">
      <ListItem spacing="sm-top">Content</ListItem>
    </UnorderedList>,
  );
  expect(screen.getByRole('list')).toHaveClass(
    'eds-text--unordered-list--spacing-md',
  );
  expect(screen.getByRole('listitem')).toHaveClass(
    'eds-text--list-item--spacing-sm-top',
  );
});
