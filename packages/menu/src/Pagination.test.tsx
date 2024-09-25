import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Pagination, PaginationProps } from './Pagination';

const createWithDefaults =
  (defaults: PaginationProps, getAllRenderUtils = false) =>
  (props: Partial<PaginationProps> = {}) => {
    const renderUtils = render(<Pagination {...defaults} {...props} />);
    return getAllRenderUtils ? renderUtils : renderUtils.container;
  };

test('renders the correct items for large pageCounts', () => {
  const pageChange = jest.fn();
  const renderWithProps = createWithDefaults({
    pageCount: 100,
    currentPage: 1,
    onPageChange: () => {
      pageChange();
    },
  });
  expect(renderWithProps({ currentPage: 1 })).toHaveTextContent('12345…100');
  expect(renderWithProps({ currentPage: 2 })).toHaveTextContent('12345…100');
  expect(renderWithProps({ currentPage: 3 })).toHaveTextContent('12345…100');
  expect(renderWithProps({ currentPage: 4 })).toHaveTextContent('12345…100');
  expect(renderWithProps({ currentPage: 5 })).toHaveTextContent('1…456…100');
  expect(renderWithProps({ currentPage: 6 })).toHaveTextContent('1…567…100');

  expect(renderWithProps({ currentPage: 96 })).toHaveTextContent(
    '1…959697…100',
  );
  expect(renderWithProps({ currentPage: 97 })).toHaveTextContent(
    '1…96979899100',
  );
  expect(renderWithProps({ currentPage: 98 })).toHaveTextContent(
    '1…96979899100',
  );
  expect(renderWithProps({ currentPage: 99 })).toHaveTextContent(
    '1…96979899100',
  );
  expect(renderWithProps({ currentPage: 100 })).toHaveTextContent(
    '1…96979899100',
  );
});

test('renders the correct items for small pageCounts', () => {
  const pageChange = jest.fn();
  const renderWithProps = createWithDefaults({
    pageCount: 7,
    currentPage: 1,
    onPageChange: () => {
      pageChange();
    },
  });
  expect(renderWithProps()).toHaveTextContent('1234567');
  expect(renderWithProps({ currentPage: 2 })).toHaveTextContent('1234567');
  expect(renderWithProps({ currentPage: 4 })).toHaveTextContent('1234567');
  expect(renderWithProps({ pageCount: 6 })).toHaveTextContent('123456');
  expect(renderWithProps({ pageCount: 5 })).toHaveTextContent('12345');
  expect(renderWithProps({ pageCount: 4 })).toHaveTextContent('1234');
  expect(renderWithProps({ pageCount: 3 })).toHaveTextContent('123');
  expect(renderWithProps({ pageCount: 2 })).toHaveTextContent('12');
  expect(renderWithProps({ pageCount: 1 })).toHaveTextContent('1');
});

test('Previous and next buttons work as expected', () => {
  const pageChangeSpy = jest.fn();
  const { queryByLabelText, getByLabelText, rerender } = render(
    <Pagination
      pageCount={3}
      currentPage={1}
      onPageChange={pageChangeSpy}
      previousPageLabel="Previous page"
      nextPageLabel="Next page"
    />,
  );
  expect(queryByLabelText('Previous page')).toBeDisabled();
  expect(getByLabelText('Next page')).not.toBeDisabled();

  fireEvent.click(getByLabelText('Next page'));
  expect(pageChangeSpy).toHaveBeenLastCalledWith(2);

  rerender(
    <Pagination
      pageCount={3}
      currentPage={2}
      onPageChange={pageChangeSpy}
      previousPageLabel="Previous page"
      nextPageLabel="Next page"
    />,
  );

  expect(getByLabelText('Previous page')).not.toBeDisabled();
  expect(getByLabelText('Next page')).not.toBeDisabled();

  fireEvent.click(getByLabelText('Next page'));
  expect(pageChangeSpy).toHaveBeenLastCalledWith(3);

  rerender(
    <Pagination
      pageCount={3}
      currentPage={3}
      onPageChange={pageChangeSpy}
      previousPageLabel="Previous page"
      nextPageLabel="Next page"
    />,
  );

  expect(getByLabelText('Previous page')).not.toBeDisabled();
  expect(queryByLabelText('Next page')).toBeDisabled();

  fireEvent.click(getByLabelText('Previous page'));
  expect(pageChangeSpy).toHaveBeenLastCalledWith(2);
});

test('clicking the buttons calls the callback with the correct number', () => {
  const pageChangeSpy = jest.fn();
  const { getByText } = render(
    <Pagination pageCount={5} currentPage={3} onPageChange={pageChangeSpy} />,
  );

  fireEvent.click(getByText('1'));
  expect(pageChangeSpy).toHaveBeenLastCalledWith(1);

  fireEvent.click(getByText('5'));
  expect(pageChangeSpy).toHaveBeenLastCalledWith(5);
});
test('the selected element is disabled', () => {
  const pageChange = jest.fn();
  const { getByText } = render(
    <Pagination
      pageCount={5}
      currentPage={3}
      onPageChange={() => {
        pageChange();
      }}
    />,
  );

  expect(getByText('3')).toBeDisabled();
});
test('renders the currentPage as selected', () => {
  const pageChange = jest.fn();
  const { getByText } = render(
    <Pagination
      pageCount={5}
      currentPage={3}
      onPageChange={() => {
        pageChange();
      }}
    />,
  );

  expect(getByText('3')).toHaveAttribute('aria-current', 'page');
  expect(getByText('3')).toHaveClass(
    'eds-pagination__controls__page--selected',
  );
});

test('page input works as expected', () => {
  const pageChangeSpy = jest.fn();
  const { getByRole, getByLabelText } = render(
    <Pagination
      pageCount={5}
      currentPage={3}
      onPageChange={pageChangeSpy}
      showInput
      inputLabel="testlabel"
    />,
  );

  const input = getByLabelText('testlabel', { selector: 'input' });
  const form = getByRole('form');
  fireEvent.change(input, { target: { value: '2' } });
  expect(pageChangeSpy).not.toHaveBeenCalled();

  fireEvent.submit(form);
  expect(pageChangeSpy).toHaveBeenLastCalledWith(2);

  // if you're submitting the same value as the current value, don't call the
  // onPageChange callback
  fireEvent.change(input, { target: { value: '3' } });
  fireEvent.submit(form);
  expect(pageChangeSpy).toHaveBeenCalledTimes(1);

  // When handled values that are too big - assume last page
  fireEvent.change(input, { target: { value: '100' } });
  fireEvent.submit(form);
  expect(pageChangeSpy).toHaveBeenLastCalledWith(5); // page count

  // When handled values less than 1 - assume first page
  fireEvent.change(input, { target: { value: '-19' } });
  fireEvent.submit(form);
  expect(pageChangeSpy).toHaveBeenLastCalledWith(1);
});
