import { createRef } from 'react';
import { RenderResult, render, screen } from '@testing-library/react';
import { BusIcon, NorwayIcon, SearchIcon } from '@entur/icons';
import { describeComponentContract } from '../../../tests/jest/componentContract';

const getSvg = ({ container }: RenderResult) =>
  container.querySelector('svg') as unknown as HTMLElement;

describeComponentContract('SearchIcon', {
  render: props => <SearchIcon {...props} />,
  getElement: getSvg,
  baseClassName: 'eds-icon',
});

test('an icon forwards its ref to the svg element', () => {
  const ref = createRef<SVGSVGElement>();
  const { container } = render(<SearchIcon ref={ref} />);

  expect(ref.current).toBeInstanceOf(SVGSVGElement);
  expect(ref.current).toBe(container.querySelector('svg'));
});

test('an icon adds no accessibility semantics of its own', () => {
  const { container } = render(<SearchIcon />);
  const svg = container.querySelector('svg');

  expect(svg).not.toHaveAttribute('role');
  expect(svg).not.toHaveAttribute('aria-hidden');
  expect(svg).not.toHaveAttribute('aria-label');
  expect(svg?.querySelector('title')).toBeNull();
});

test('an icon forwards ARIA props so consumers can name it', () => {
  render(<SearchIcon role="img" aria-label="Search" />);

  expect(screen.getByRole('img', { name: 'Search' })).toBeInTheDocument();
});

test('an icon defaults to 1em and takes size, width and height', () => {
  const { container, rerender } = render(<SearchIcon />);
  const svg = container.querySelector('svg');
  expect(svg).toHaveAttribute('width', '1em');
  expect(svg).toHaveAttribute('height', '1em');

  rerender(<SearchIcon size={24} />);
  expect(svg).toHaveAttribute('width', '24');
  expect(svg).toHaveAttribute('height', '24');

  rerender(<SearchIcon size={24} width={32} />);
  expect(svg).toHaveAttribute('width', '32');
  expect(svg).toHaveAttribute('height', '24');
});

test('an icon adds the inline modifier without leaking inline to the DOM', () => {
  const { container, rerender } = render(<SearchIcon />);
  const svg = container.querySelector('svg');
  expect(svg).not.toHaveClass('eds-icon--inline');

  rerender(<SearchIcon inline />);
  expect(svg).toHaveClass('eds-icon', 'eds-icon--inline');
  expect(svg).not.toHaveAttribute('inline');
});

test('an icon defaults its color to currentColor', () => {
  const { container, rerender } = render(<SearchIcon />);
  const svg = container.querySelector('svg');
  expect(svg).toHaveAttribute('color', 'currentColor');

  rerender(<SearchIcon color="#123456" />);
  expect(svg).toHaveAttribute('color', '#123456');
});

test('a transport icon uses its transport class and color until a color is given', () => {
  const { container, rerender } = render(<BusIcon className="consumer" />);
  const svg = container.querySelector('svg');
  expect(svg).toHaveClass('eds-icon', 'eds-icon__bus', 'consumer');
  expect(svg).not.toHaveAttribute('color', 'currentColor');

  rerender(<BusIcon color="#123456" />);
  expect(svg).toHaveClass('eds-icon');
  expect(svg).not.toHaveClass('eds-icon__bus');
  expect(svg).toHaveAttribute('color', '#123456');
});

// Bug: the generator omits the space after "eds-icon" for colored transport icons,
// producing "eds-iconconsumer".
test.failing('a colored transport icon merges a consumer className', () => {
  const { container } = render(
    <BusIcon color="#123456" className="consumer" />,
  );

  expect(container.querySelector('svg')).toHaveClass('eds-icon', 'consumer');
});

test('an outlier icon keeps its own colors unless a color is given', () => {
  const { container, rerender } = render(<NorwayIcon className="consumer" />);
  const svg = container.querySelector('svg');
  expect(svg).toHaveClass('eds-icon__NorwayIcon', 'consumer');
  expect(svg).not.toHaveClass('eds-icon');
  expect(svg).not.toHaveAttribute('color');

  rerender(<NorwayIcon color="#123456" />);
  expect(svg).toHaveClass('eds-icon', 'eds-icon__NorwayIcon');
  expect(svg).toHaveAttribute('color', '#123456');
});
