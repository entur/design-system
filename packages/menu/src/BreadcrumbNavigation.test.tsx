import React from 'react';
import { render } from '@testing-library/react';
import { BreadcrumbNavigation } from '.';
import { BreadcrumbItem } from './BreadcrumbItem';

test('renders a breadcrumb', () => {
  const { getByText, getAllByRole } = render(
    <BreadcrumbNavigation>
      <BreadcrumbItem href="/">Hjem</BreadcrumbItem>
      <BreadcrumbItem href="/komponenter">Komponenter</BreadcrumbItem>
      <BreadcrumbItem href="/komponenter/navigasjon/breadcrumbs">
        Breadcrumbs
      </BreadcrumbItem>
    </BreadcrumbNavigation>,
  );

  expect(getAllByRole('listitem')).toHaveLength(3);
  expect(getByText('Hjem')).not.toHaveAttribute('aria-current', 'page');
  expect(getByText('Komponenter')).not.toHaveAttribute('aria-current', 'page');
  expect(getByText('Breadcrumbs')).toHaveAttribute('aria-current', 'page');
});
