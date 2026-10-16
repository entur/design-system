import { cleanup, render } from '@testing-library/react';
import { ListItem } from '../components/ListItem';
import { NumberedList } from '../components/NumberedList';
import { UnorderedList } from '../components/UnorderedList';

afterEach(cleanup);

describe('UnorderedList Component', () => {
  test('renders as ul with list items', () => {
    const { getByRole, getAllByRole } = render(
      <UnorderedList>
        <ListItem>En</ListItem>
        <ListItem>To</ListItem>
      </UnorderedList>,
    );
    expect(getByRole('list').tagName).toBe('UL');
    expect(getAllByRole('listitem')).toHaveLength(2);
  });

  test('applies spacing classes that exist in the stylesheet', () => {
    const { getByRole } = render(
      <UnorderedList spacing="md-bottom">
        <ListItem>En</ListItem>
      </UnorderedList>,
    );
    expect(getByRole('list')).toHaveClass('eds-text--spacing-md-bottom');
  });

  test('renders as different element with as prop', () => {
    const { container } = render(
      <UnorderedList as="div">
        <ListItem as="div">En</ListItem>
      </UnorderedList>,
    );
    expect(container.firstChild?.nodeName).toBe('DIV');
  });
});

describe('NumberedList Component', () => {
  test('renders as ol with type 1 by default', () => {
    const { getByRole } = render(
      <NumberedList>
        <ListItem>En</ListItem>
      </NumberedList>,
    );
    const list = getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(list).toHaveAttribute('type', '1');
    expect(list).toHaveClass('eds-text--numbered-list--type-1');
  });

  test('applies type and spacing', () => {
    const { getByRole } = render(
      <NumberedList type="A" spacing="lg">
        <ListItem>En</ListItem>
      </NumberedList>,
    );
    const list = getByRole('list');
    expect(list).toHaveAttribute('type', 'A');
    expect(list).toHaveClass(
      'eds-text--numbered-list--type-A',
      'eds-text--spacing-lg',
    );
  });
});

describe('ListItem Component', () => {
  test('renders title before content', () => {
    const { getByRole, getByText } = render(
      <UnorderedList>
        <ListItem title="Tittel">Innhold</ListItem>
      </UnorderedList>,
    );
    const title = getByText('Tittel');
    expect(title).toHaveClass('eds-text--list-item__title');
    expect(getByRole('listitem').firstChild).toBe(title);
  });

  test('applies spacing and custom className', () => {
    const { getByRole } = render(
      <UnorderedList>
        <ListItem spacing="xs" className="custom">
          Innhold
        </ListItem>
      </UnorderedList>,
    );
    expect(getByRole('listitem')).toHaveClass(
      'eds-text--list-item',
      'eds-text--spacing-xs',
      'custom',
    );
  });
});
