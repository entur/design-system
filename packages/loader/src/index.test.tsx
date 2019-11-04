import React from 'react';
import { render } from '@testing-library/react';

import { Loader } from '.';

test('renders a scruptious looking loader', () => {
  const { getByText } = render(<Loader>Vennligst vent</Loader>);
  expect(getByText('Vennligst vent')).toBeInTheDocument();
});
