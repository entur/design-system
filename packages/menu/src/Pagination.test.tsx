import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination, PaginationProps } from './Pagination';
import { describeComponentContract } from '../../../tests/jest/componentContract';

describeComponentContract('Pagination', {
  render: props => (
    <Pagination
      pageCount={3}
      currentPage={1}
      onPageChange={() => {}}
      {...props}
    />
  ),
  getElement: () => screen.getByRole('navigation', { name: 'Paginering' }),
  baseClassName: 'eds-pagination',
});

const renderedSequence = (props: Partial<PaginationProps>) => {
  const { unmount } = render(
    <Pagination
      pageCount={1}
      currentPage={1}
      onPageChange={() => {}}
      {...props}
    />,
  );
  const screenReaderStatus = screen.getByText(/^Nåværende side:/).textContent;
  const sequence = screen
    .getByRole('navigation')
    .textContent?.replace(screenReaderStatus ?? '', '');
  unmount();
  return sequence;
};

test.each([
  [1, '12345…100'],
  [2, '12345…100'],
  [3, '12345…100'],
  [4, '12345…100'],
  [5, '1…456…100'],
  [6, '1…567…100'],
  [96, '1…959697…100'],
  [97, '1…96979899100'],
  [98, '1…96979899100'],
  [99, '1…96979899100'],
  [100, '1…96979899100'],
])('shows page %i of 100 as %s', (currentPage, sequence) => {
  expect(renderedSequence({ pageCount: 100, currentPage })).toBe(sequence);
});

test.each([
  [7, 1, '1234567'],
  [7, 2, '1234567'],
  [7, 4, '1234567'],
  [6, 1, '123456'],
  [5, 1, '12345'],
  [4, 1, '1234'],
  [3, 1, '123'],
  [2, 1, '12'],
  [1, 1, '1'],
])(
  'shows every page without ellipsis for %i pages (current %i)',
  (pageCount, currentPage, sequence) => {
    expect(renderedSequence({ pageCount, currentPage })).toBe(sequence);
  },
);

test('previous and next buttons move one page and disable at the ends', async () => {
  const user = userEvent.setup();
  const pageChangeSpy = jest.fn();
  const renderAt = (currentPage: number) => (
    <Pagination
      pageCount={3}
      currentPage={currentPage}
      onPageChange={pageChangeSpy}
      previousPageLabel="Previous page"
      nextPageLabel="Next page"
    />
  );
  const { rerender } = render(renderAt(1));
  const previous = screen.getByRole('button', { name: 'Previous page' });
  const next = screen.getByRole('button', { name: 'Next page' });
  expect(previous).toBeDisabled();
  expect(next).toBeEnabled();
  await user.click(next);
  expect(pageChangeSpy).toHaveBeenLastCalledWith(2);

  rerender(renderAt(2));
  expect(previous).toBeEnabled();
  expect(next).toBeEnabled();
  await user.click(next);
  expect(pageChangeSpy).toHaveBeenLastCalledWith(3);

  rerender(renderAt(3));
  expect(previous).toBeEnabled();
  expect(next).toBeDisabled();
  await user.click(previous);
  expect(pageChangeSpy).toHaveBeenLastCalledWith(2);
  expect(pageChangeSpy).toHaveBeenCalledTimes(3);
});

test('clicking a page button requests that page', async () => {
  const user = userEvent.setup();
  const pageChangeSpy = jest.fn();
  render(
    <Pagination pageCount={5} currentPage={3} onPageChange={pageChangeSpy} />,
  );

  await user.click(screen.getByRole('button', { name: 'Gå til side 1' }));
  expect(pageChangeSpy).toHaveBeenLastCalledWith(1);

  await user.click(
    screen.getByRole('button', { name: 'Gå til side 5, siste side' }),
  );
  expect(pageChangeSpy).toHaveBeenLastCalledWith(5);
});

test('marks the current page and prevents selecting it again', async () => {
  const user = userEvent.setup();
  const pageChange = jest.fn();
  render(
    <Pagination pageCount={5} currentPage={3} onPageChange={pageChange} />,
  );
  const current = screen.getByRole('button', { current: 'page' });
  expect(current).toHaveAccessibleName('Gå til side 3');
  expect(current).toBeDisabled();
  expect(current).toHaveClass('eds-pagination__controls__page--selected');
  expect(screen.getByRole('button', { name: 'Gå til side 2' })).not.toHaveClass(
    'eds-pagination__controls__page--selected',
  );
  await user.click(current);
  expect(pageChange).not.toHaveBeenCalled();
});

test('submits edited page input, clamps bounds and follows currentPage updates', async () => {
  const user = userEvent.setup();
  const pageChangeSpy = jest.fn();
  const { rerender } = render(
    <Pagination
      pageCount={5}
      currentPage={3}
      onPageChange={pageChangeSpy}
      showInput
      inputLabel="testlabel"
    />,
  );

  const input = screen.getByRole('spinbutton', { name: 'testlabel' });
  // user-event does not emulate implicit Enter submission for number inputs.
  const form = screen.getByRole('form');
  expect(input).toHaveValue(3);
  await user.clear(input);
  await user.type(input, '2');
  expect(pageChangeSpy).not.toHaveBeenCalled();

  fireEvent.submit(form);
  expect(pageChangeSpy.mock.calls).toEqual([[2]]);

  await user.clear(input);
  await user.type(input, '3');
  fireEvent.submit(form);
  expect(pageChangeSpy).toHaveBeenCalledTimes(1);

  await user.clear(input);
  await user.type(input, '100');
  fireEvent.submit(form);
  expect(input).toHaveValue(5);

  await user.clear(input);
  await user.type(input, '-19');
  fireEvent.submit(form);
  expect(input).toHaveValue(1);
  expect(pageChangeSpy.mock.calls).toEqual([[2], [5], [1]]);

  rerender(
    <Pagination
      pageCount={5}
      currentPage={4}
      onPageChange={pageChangeSpy}
      showInput
      inputLabel="testlabel"
    />,
  );
  expect(input).toHaveValue(4);
  expect(screen.getByRole('button', { current: 'page' })).toHaveAccessibleName(
    'Gå til side 4',
  );
  expect(pageChangeSpy).toHaveBeenCalledTimes(3);
});

test('hides pagination for zero pages and disables every control for one page', async () => {
  const user = userEvent.setup();
  const onPageChange = jest.fn();
  const { rerender } = render(
    <Pagination pageCount={0} currentPage={1} onPageChange={onPageChange} />,
  );
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  rerender(
    <Pagination pageCount={1} currentPage={1} onPageChange={onPageChange} />,
  );
  expect(
    screen.getByRole('navigation', { name: 'Paginering' }),
  ).toBeInTheDocument();
  const controls = screen.getAllByRole('button');
  expect(controls).toHaveLength(3);
  for (const control of controls) {
    expect(control).toBeDisabled();
    await user.click(control);
  }
  expect(onPageChange).not.toHaveBeenCalled();
});

test('caps the final result range and requests a new page size without changing pages', async () => {
  const user = userEvent.setup();
  const onPageChange = jest.fn();
  const onResultsPerPageChange = jest.fn();
  render(
    <Pagination
      pageCount={3}
      currentPage={3}
      onPageChange={onPageChange}
      numberOfResults={23}
      resultsPerPage={10}
      resultsPerPageOptions={[10, 20]}
      onResultsPerPageChange={onResultsPerPageChange}
    />,
  );
  expect(screen.getByText('Viser resultat 21–23 av 23')).toBeInTheDocument();
  const trigger = screen.getByRole('button', {
    name: 'Viser 10 resultater. Trykk for å endre antall. Åpner en flervalgsmeny.',
  });
  await user.click(trigger);
  expect(screen.getAllByRole('menuitem').map(item => item.textContent)).toEqual(
    ['10', '20'],
  );
  const option = screen.getByRole('menuitem', { name: '20' });
  await user.hover(option);
  await waitFor(() => expect(option).toHaveFocus());
  await user.click(option);
  expect(onResultsPerPageChange.mock.calls).toEqual([[20]]);
  expect(onPageChange).not.toHaveBeenCalled();
  expect(screen.getByText('Viser resultat 21–23 av 23')).toBeInTheDocument();
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
