import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Button, IconButton } from '.';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';

test('Button renders and is clickable', () => {
  const children = 'Button children';
  const testClass = 'longtesterclassname';
  const spy = jest.fn();

  const { getByTestId } = render(
    <Button
      variant="primary"
      onClick={spy}
      data-testid="testerButton"
      className={testClass}
    >
      {children}
    </Button>,
  );

  const testerButton = getByTestId('testerButton');
  expect(testerButton).toHaveClass(testClass);
  expect(testerButton).toContainHTML(children);

  fireEvent.click(testerButton);
  expect(spy).toHaveBeenCalled();
});

test('Button renders as an <a> tag, with an href-property', () => {
  const children = 'Button children';
  const hrefLink = '#coolLinkAddresss';
  const { getByTestId } = render(
    <Button
      variant="primary"
      as="a"
      href={hrefLink}
      data-testid="testerButton2"
    >
      {children}
    </Button>,
  );
  const testerButton = getByTestId('testerButton2');

  expect(testerButton.nodeName).toBe('A');
  expect(testerButton).toHaveAttribute('href', hrefLink);
});

test('adds the correct icon classes', () => {
  const someVariable = 'World';
  const { getByRole, rerender } = render(
    <Button variant="primary">
      <svg /> hello {someVariable}
    </Button>,
  );
  expect(getByRole('button')).toHaveClass('eds-button--leading-icon');
  expect(getByRole('button')).not.toHaveClass('eds-button--trailing-icon');

  rerender(
    <Button variant="primary">
      hello {someVariable} <svg />
    </Button>,
  );

  expect(getByRole('button')).not.toHaveClass('eds-button--leading-icon');
  expect(getByRole('button')).toHaveClass('eds-button--trailing-icon');

  rerender(<Button variant="primary">hello {someVariable}</Button>);

  expect(getByRole('button')).not.toHaveClass('eds-button--leading-icon');
  expect(getByRole('button')).not.toHaveClass('eds-button--trailing-icon');

  rerender(
    <Button variant="primary">
      <svg />
    </Button>,
  );

  expect(getByRole('button')).not.toHaveClass('eds-button--leading-icon');
  expect(getByRole('button')).not.toHaveClass('eds-button--trailing-icon');
});

test('test variant-components directly', () => {
  const spy = jest.fn();
  const { getByRole, rerender, getByText, getByTestId } = render(
    <PrimaryButton onClick={spy}>Primary</PrimaryButton>,
  );
  fireEvent.click(getByRole('button'));
  expect(spy).toHaveBeenCalledTimes(1);
  expect(getByText('Primary')).toBeInTheDocument();
  rerender(<SecondaryButton size="large">Secondary</SecondaryButton>);
  expect(getByText('Secondary')).toBeInTheDocument();

  const hrefLink = '#coolLinkAddresss';
  rerender(
    <PrimaryButton as="a" href={hrefLink} data-testid="link-button">
      Link
    </PrimaryButton>,
  );
  const testerButton = getByTestId('link-button');
  expect(testerButton.nodeName).toBe('A');
  expect(testerButton).toHaveAttribute('href', hrefLink);
});

test('IconButton renders, with as-prop and others', () => {
  const spy = jest.fn();
  const hrefLink = '#coolLinkAddresss';
  const { getByText, getByTestId } = render(
    <IconButton
      as="a"
      href={hrefLink}
      onClick={spy}
      data-testid="link-icon-button"
    >
      IconButton
    </IconButton>,
  );
  const testerButton = getByTestId('link-icon-button');
  fireEvent.click(testerButton);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(getByText('IconButton')).toBeInTheDocument();

  expect(testerButton.nodeName).toBe('A');
  expect(testerButton).toHaveAttribute('href', hrefLink);
});
