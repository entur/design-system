import React from 'react';
import { render } from '@testing-library/react';
import { Breadcrumbs } from '.';

test('renders a breadcrumb', () => {
  const links = [
    { link: '/', label: 'Hjem' },
    { link: '/komponenter', label: 'Komponenter' },
    { link: '/komponenter/navigasjon/breadcrumbs', label: 'Breadcrumbs' },
  ];
  const { getByText, getAllByRole } = render(<Breadcrumbs links={links} />);

  expect(getAllByRole('listitem')).toHaveLength(3);
  expect(getByText('Hjem')).not.toHaveAttribute('aria-current', 'page');
  expect(getByText('Komponenter')).not.toHaveAttribute('aria-current', 'page');
  expect(getByText('Breadcrumbs')).toHaveAttribute('aria-current', 'page');
});
