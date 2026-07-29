import { render } from '@testing-library/react';
import { Flex } from './Flex';
import { FlexSpacer } from './FlexSpacer';

test('Flex renders with class', () => {
  const { getByTestId } = render(<Flex data-testid="flex" />);
  expect(getByTestId('flex')).toHaveClass('eds-layout-flex');
});

test('Flex sets display', () => {
  const { getByTestId } = render(
    <Flex data-testid="flex" display="inline-flex" />,
  );
  expect(getByTestId('flex').style.getPropertyValue('--flex-display')).toBe(
    'inline-flex',
  );
});

test('Flex sets plain direction at base only', () => {
  const { getByTestId } = render(
    <Flex data-testid="flex" direction="column" />,
  );
  const el = getByTestId('flex');
  expect(el.style.getPropertyValue('--flex-direction-base')).toBe('column');
  expect(el.style.getPropertyValue('--flex-direction-m')).toBe('');
  expect(el.style.getPropertyValue('--flex-direction-lg')).toBe('');
  expect(el.style.getPropertyValue('--flex-direction-xl')).toBe('');
});

test('Flex sets responsive direction for explicitly provided breakpoints', () => {
  const { getByTestId } = render(
    <Flex data-testid="flex" direction={{ base: 'column', m: 'row' }} />,
  );
  const el = getByTestId('flex');
  expect(el.style.getPropertyValue('--flex-direction-base')).toBe('column');
  expect(el.style.getPropertyValue('--flex-direction-m')).toBe('row');
  expect(el.style.getPropertyValue('--flex-direction-lg')).toBe('');
  expect(el.style.getPropertyValue('--flex-direction-xl')).toBe('');
});

test('Flex only sets vars for breakpoints specified in responsive object', () => {
  const { getByTestId } = render(
    <Flex data-testid="flex" direction={{ base: 'column', lg: 'row' }} />,
  );
  const el = getByTestId('flex');
  expect(el.style.getPropertyValue('--flex-direction-base')).toBe('column');
  expect(el.style.getPropertyValue('--flex-direction-m')).toBe('');
  expect(el.style.getPropertyValue('--flex-direction-lg')).toBe('row');
  expect(el.style.getPropertyValue('--flex-direction-xl')).toBe('');
});

test('Flex sets responsive gap as spacing vars for explicit breakpoints', () => {
  const { getByTestId } = render(
    <Flex data-testid="flex" gap={{ base: 'xs', m: 'm' }} />,
  );
  const el = getByTestId('flex');
  expect(el.style.getPropertyValue('--flex-gap-base')).toBe('var(--xs)');
  expect(el.style.getPropertyValue('--flex-gap-m')).toBe('var(--m)');
  expect(el.style.getPropertyValue('--flex-gap-lg')).toBe('');
  expect(el.style.getPropertyValue('--flex-gap-xl')).toBe('');
});

test('Flex sets responsive direction for s breakpoint', () => {
  const { getByTestId } = render(
    <Flex data-testid="flex" direction={{ base: 'column', s: 'row' }} />,
  );
  const el = getByTestId('flex');
  expect(el.style.getPropertyValue('--flex-direction-base')).toBe('column');
  expect(el.style.getPropertyValue('--flex-direction-s')).toBe('row');
  expect(el.style.getPropertyValue('--flex-direction-m')).toBe('');
  expect(el.style.getPropertyValue('--flex-direction-lg')).toBe('');
  expect(el.style.getPropertyValue('--flex-direction-xl')).toBe('');
});

test('Flex sets align and justify', () => {
  const { getByTestId } = render(
    <Flex data-testid="flex" align="center" justify="space-between" />,
  );
  const el = getByTestId('flex');
  expect(el.style.getPropertyValue('--flex-align-items-base')).toBe('center');
  expect(el.style.getPropertyValue('--flex-justify-content-base')).toBe(
    'space-between',
  );
});

test('FlexSpacer renders with presentation semantics', () => {
  const { getByTestId } = render(<FlexSpacer data-testid="spacer" />);
  const spacer = getByTestId('spacer');
  expect(spacer).toHaveClass('eds-layout-flex-spacer');
  expect(spacer).toHaveAttribute('role', 'presentation');
  expect(spacer).toHaveAttribute('aria-hidden', 'true');
});
