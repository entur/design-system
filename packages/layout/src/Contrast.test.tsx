import { render, screen, within } from '@testing-library/react';
import { describeComponentContract } from '../../../tests/jest/componentContract';
import { Contrast, useContrast } from './Contrast';

describeComponentContract('Contrast', {
  render: props => <Contrast data-testid="contrast" {...props} />,
  getElement: () => screen.getByTestId('contrast'),
  baseClassName: 'eds-contrast',
  refElement: HTMLDivElement,
  as: 'nav',
});

function ContrastConsumer() {
  return <p>{useContrast() ? 'Contrast' : 'Standard'}</p>;
}

test('Contrast scopes context to descendants without leaking to siblings', () => {
  render(
    <>
      <Contrast as="section" aria-label="Contrast region">
        <ContrastConsumer />
        <Contrast as="section" aria-label="Nested region">
          <ContrastConsumer />
        </Contrast>
      </Contrast>
      <section aria-label="Standard region">
        <ContrastConsumer />
      </section>
    </>,
  );

  expect(
    within(
      screen.getByRole('region', { name: 'Contrast region' }),
    ).getAllByText('Contrast'),
  ).toHaveLength(2);
  expect(
    within(screen.getByRole('region', { name: 'Standard region' })).getByText(
      'Standard',
    ),
  ).toBeInTheDocument();
});
