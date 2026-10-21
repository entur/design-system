import { render, screen, within } from '@testing-library/react';

import {
  Loader,
  LoadingDots,
  SkeletonCircle,
  SkeletonRectangle,
  SkeletonWrapper,
  Spinner,
} from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

test('exposes an indeterminate loading message in a polite, busy alert', () => {
  render(<Loader>Vennligst vent</Loader>);

  const alert = screen.getByRole('alert');
  expect(alert).toHaveAttribute('aria-busy', 'true');
  expect(alert).toHaveAttribute('aria-live', 'polite');
  expect(alert).toHaveTextContent(/^Vennligst vent$/);
});

test('updates progress from zero to completion and removes it when indeterminate', () => {
  const { rerender } = render(<Loader progress={0}>Laster ned</Loader>);

  expect(
    within(screen.getByRole('alert')).getByText('0 %'),
  ).toBeInTheDocument();

  rerender(<Loader progress={42}>Laster ned</Loader>);
  expect(
    within(screen.getByRole('alert')).getByText('42 %'),
  ).toBeInTheDocument();
  expect(screen.queryByText('0 %')).not.toBeInTheDocument();

  rerender(<Loader progress={100}>Laster ned</Loader>);
  expect(
    within(screen.getByRole('alert')).getByText('100 %'),
  ).toBeInTheDocument();
  expect(screen.queryByText('42 %')).not.toBeInTheDocument();

  rerender(<Loader progress="indeterminate">Laster ned</Loader>);
  expect(screen.getByRole('alert')).toHaveTextContent(/^Laster ned$/);
});

test('supports an accessible name and description without a visible loading label', () => {
  render(
    <>
      <p id="loading-description">Dette kan ta et øyeblikk.</p>
      <Loader
        aria-label="Henter avganger"
        aria-describedby="loading-description"
      />
    </>,
  );

  expect(
    screen.getByRole('alert', { name: 'Henter avganger' }),
  ).toHaveAccessibleDescription('Dette kan ta et øyeblikk.');
});

test('gives skeleton content a default loading announcement', () => {
  render(
    <SkeletonWrapper>
      <p>Henter reisedetaljer</p>
    </SkeletonWrapper>,
  );

  const alert = screen.getByRole('alert', { name: 'Laster inn innhold …' });
  expect(alert).toHaveAttribute('aria-live', 'polite');
  expect(alert).toHaveAttribute('aria-busy', 'true');
  expect(within(alert).getByText('Henter reisedetaljer')).toBeInTheDocument();
});

test('composes hidden skeleton shapes under one customizable loading announcement', () => {
  const { rerender } = render(
    <SkeletonWrapper loadingAriaLabel="Henter profil">
      <SkeletonCircle size="3rem" aria-hidden="true" data-testid="avatar" />
      <SkeletonRectangle
        width="12rem"
        height="1rem"
        aria-hidden="true"
        data-testid="name"
      />
    </SkeletonWrapper>,
  );

  const alert = screen.getByRole('alert', { name: 'Henter profil' });
  expect(screen.getAllByRole('alert')).toHaveLength(1);
  expect(within(alert).getByTestId('avatar')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  expect(within(alert).getByTestId('name')).toHaveAttribute(
    'aria-hidden',
    'true',
  );

  rerender(
    <SkeletonWrapper loadingAriaLabel="Henter reiser">
      <SkeletonRectangle aria-hidden="true" />
    </SkeletonWrapper>,
  );
  expect(screen.getByRole('alert', { name: 'Henter reiser' })).toHaveAttribute(
    'aria-busy',
    'true',
  );
  expect(
    screen.queryByRole('alert', { name: 'Henter profil' }),
  ).not.toBeInTheDocument();
});

test('progress sets the bar width and indeterminate selects its animated class', () => {
  const { container, rerender } = render(<Loader progress={42} />);
  const bar = container.querySelector('.eds-loader__bar');
  expect(bar).not.toHaveClass('eds-loader__bar--indeterminate');
  expect(bar).toHaveStyle({ '--loader-width': '42%' });

  rerender(<Loader />);
  expect(bar).toHaveClass('eds-loader__bar--indeterminate');
  expect(bar).not.toHaveStyle({ '--loader-width': '42%' });
});

test('skeleton shapes size themselves from their props', () => {
  render(
    <>
      <SkeletonCircle size="3rem" aria-label="Avatar" />
      <SkeletonRectangle width="12rem" height="1rem" aria-label="Navn" />
    </>,
  );
  expect(screen.getByRole('alert', { name: 'Avatar' })).toHaveStyle({
    width: '3rem',
    height: '3rem',
  });
  expect(screen.getByRole('alert', { name: 'Navn' })).toHaveStyle({
    width: '12rem',
    height: '1rem',
  });
});

// Bug: skeleton shapes spread rest after style, so a consumer style drops the size props.
test.failing.each([
  {
    name: 'SkeletonCircle',
    shape: <SkeletonCircle size="3rem" style={{ marginTop: '7px' }} />,
  },
  {
    name: 'SkeletonRectangle',
    shape: (
      <SkeletonRectangle
        width="3rem"
        height="3rem"
        style={{ marginTop: '7px' }}
      />
    ),
  },
])('$name keeps its size when given a consumer style', ({ shape }) => {
  render(shape);
  expect(screen.getByRole('alert')).toHaveStyle({
    width: '3rem',
    height: '3rem',
    marginTop: '7px',
  });
});

test('LoadingDots selects its color modifier class', () => {
  const { rerender } = render(<LoadingDots aria-label="Laster" />);
  expect(screen.getByLabelText('Laster')).toHaveClass(
    'eds-loading-dots--color-blue',
  );

  rerender(<LoadingDots aria-label="Laster" color="white" />);
  expect(screen.getByLabelText('Laster')).toHaveClass(
    'eds-loading-dots--color-white',
  );
});

describeComponentContract('Loader', {
  render: props => <Loader {...props}>Vennligst vent</Loader>,
  getElement: () => screen.getByRole('alert'),
  baseClassName: 'eds-loader',
});

describeComponentContract('SkeletonWrapper', {
  render: props => (
    <SkeletonWrapper {...props}>
      <p>Henter reisedetaljer</p>
    </SkeletonWrapper>
  ),
  getElement: () => screen.getByRole('alert'),
  baseClassName: 'eds-skeleton-wrapper',
});

describeComponentContract('SkeletonCircle', {
  render: props => <SkeletonCircle size="3rem" {...props} />,
  getElement: () => screen.getByRole('alert'),
  baseClassName: 'eds-skeleton-circle',
});

describeComponentContract('SkeletonRectangle', {
  render: props => <SkeletonRectangle {...props} />,
  getElement: () => screen.getByRole('alert'),
  baseClassName: 'eds-skeleton-rectangle',
});

describeComponentContract('Spinner', {
  render: props => <Spinner aria-label="Laster" {...props} />,
  getElement: () => screen.getByLabelText('Laster'),
  baseClassName: 'eds-spinner',
});

describeComponentContract('LoadingDots', {
  render: props => <LoadingDots aria-label="Laster" {...props} />,
  getElement: () => screen.getByLabelText('Laster'),
  baseClassName: 'eds-loading-dots',
});
