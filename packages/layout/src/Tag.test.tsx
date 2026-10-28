import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describeComponentContract } from '../../../tests/jest/componentContract';
import { Tag } from './Tag';

describeComponentContract('Tag', {
  render: props => <Tag {...props}>Buss</Tag>,
  getElement: () => screen.getByText('Buss'),
  baseClassName: 'eds-tag',
  refElement: HTMLSpanElement,
  as: 'a',
});

test('Tag defaults to a neutral, medium span', () => {
  render(<Tag>Buss</Tag>);
  const tag = screen.getByText('Buss');

  expect(tag.tagName).toBe('SPAN');
  expect(tag).toHaveClass('eds-tag--variant-neutral', 'eds-tag--size-medium');
});

test('Tag renders the given variant and size', () => {
  render(
    <Tag variant="mystic" size="large">
      Tog
    </Tag>,
  );

  expect(screen.getByText('Tog')).toHaveClass(
    'eds-tag--variant-mystic',
    'eds-tag--size-large',
  );
});

test('Tag maps the deprecated compact prop to the small size', () => {
  render(<Tag compact>Ferje</Tag>);

  expect(screen.getByText('Ferje')).toHaveClass('eds-tag--size-small');
  expect(screen.getByText('Ferje')).not.toHaveClass('eds-tag--size-medium');
});

test('Tag lets an explicit size win over compact', () => {
  render(
    <Tag compact size="large">
      Ferje
    </Tag>,
  );

  expect(screen.getByText('Ferje')).toHaveClass('eds-tag--size-large');
  expect(screen.getByText('Ferje')).not.toHaveClass('eds-tag--size-small');
});

test('Tag composes a keyboard-accessible link with a decorative icon', async () => {
  const user = userEvent.setup();
  const ref = createRef<HTMLAnchorElement>();
  render(
    <Tag as="a" href="/bus" ref={ref}>
      <svg aria-hidden="true">
        <title>Bus icon</title>
      </svg>
      Buss
    </Tag>,
  );

  const link = screen.getByRole('link', { name: 'Buss' });
  expect(ref.current).toBe(link);
  expect(link).toHaveAttribute('href', '/bus');
  await user.tab();
  expect(link).toHaveFocus();
});
