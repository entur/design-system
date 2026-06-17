import React from 'react';
import { render } from '@testing-library/react';
import { Logo } from './Logo';

test('renders the Entur svg SVG', () => {
  const { container } = render(<Logo />);
  expect(container.querySelector('svg')).toBeInTheDocument();
  expect(container.querySelector('.eds-logo')).toBeInTheDocument();
});

test('renders with product name', () => {
  const { getByText } = render(<Logo productName="Tavla" />);
  expect(getByText('Tavla')).toBeInTheDocument();
  expect(getByText('Tavla')).toHaveClass('eds-logo__product-name');
});

test('does not render product name span when omitted', () => {
  const { container } = render(<Logo />);
  expect(
    container.querySelector('.eds-logo__product-name'),
  ).not.toBeInTheDocument();
});

test('renders as div by default', () => {
  const { container } = render(<Logo />);
  expect(container.firstChild?.nodeName).toBe('DIV');
});

test('renders as anchor when href is provided', () => {
  const { container } = render(<Logo href="/" />);
  expect(container.firstChild?.nodeName).toBe('A');
  expect(container.firstChild).toHaveAttribute('href', '/');
});

test('applies size class', () => {
  const { container, rerender } = render(<Logo size="medium" />);
  expect(container.querySelector('.eds-logo--medium')).toBeInTheDocument();

  rerender(<Logo size="small" />);
  expect(container.querySelector('.eds-logo--small')).toBeInTheDocument();
});

test('defaults to medium size', () => {
  const { container } = render(<Logo />);
  expect(container.querySelector('.eds-logo--medium')).toBeInTheDocument();
});

test('applies additional className', () => {
  const { container } = render(<Logo className="custom-class" />);
  expect(container.firstChild).toHaveClass('eds-logo');
  expect(container.firstChild).toHaveClass('custom-class');
});

test('supports polymorphic as prop', () => {
  const { container } = render(<Logo as="nav" />);
  expect(container.firstChild?.nodeName).toBe('NAV');
});

test('forwards additional props', () => {
  const { container } = render(<Logo data-testid="logo" />);
  expect(container.firstChild).toHaveAttribute('data-testid', 'logo');
});
