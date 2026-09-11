import { render } from '@testing-library/react';
import { Tag } from './Tag';

test('Tag defaults to a neutral, medium span', () => {
  const { getByTestId } = render(<Tag data-testid="tag">Buss</Tag>);
  const tag = getByTestId('tag');

  expect(tag.nodeName).toBe('SPAN');
  expect(tag).toHaveClass('eds-tag');
  expect(tag).toHaveClass('eds-tag--variant-neutral');
  expect(tag).toHaveClass('eds-tag--size-medium');
  expect(tag).toHaveTextContent('Buss');
});

test('Tag renders the given variant and size', () => {
  const { getByTestId } = render(
    <Tag data-testid="tag" variant="mystic" size="large" className="extra">
      Tog
    </Tag>,
  );
  const tag = getByTestId('tag');

  expect(tag).toHaveClass('eds-tag--variant-mystic');
  expect(tag).toHaveClass('eds-tag--size-large');
  expect(tag).toHaveClass('extra');
});

test('Tag maps the deprecated compact prop to the small size', () => {
  const { getByTestId } = render(
    <Tag data-testid="tag" compact>
      Ferje
    </Tag>,
  );

  expect(getByTestId('tag')).toHaveClass('eds-tag--size-small');
});

test('Tag lets an explicit size win over compact', () => {
  const { getByTestId } = render(
    <Tag data-testid="tag" compact size="large">
      Ferje
    </Tag>,
  );

  expect(getByTestId('tag')).toHaveClass('eds-tag--size-large');
});

test('Tag as-prop in use', () => {
  const { getByTestId } = render(
    <Tag as="a" href="#tag" data-testid="tag">
      Lenke
    </Tag>,
  );
  const tag = getByTestId('tag');

  expect(tag.nodeName).toBe('A');
  expect(tag).toHaveAttribute('href', '#tag');
});
