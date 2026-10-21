import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BreadcrumbNavigation } from '.';
import { BreadcrumbItem } from './BreadcrumbItem';

test('exposes ancestor links and a non-link current page', async () => {
  const user = userEvent.setup();
  const onNavigate = jest.fn(event => event.preventDefault());
  render(
    <BreadcrumbNavigation>
      <BreadcrumbItem href="/" onClick={onNavigate}>
        Hjem
      </BreadcrumbItem>
      <BreadcrumbItem href="/komponenter" onClick={onNavigate}>
        Komponenter
      </BreadcrumbItem>
      <BreadcrumbItem href="/komponenter/navigasjon/breadcrumbs">
        Breadcrumbs
      </BreadcrumbItem>
    </BreadcrumbNavigation>,
  );

  const navigation = screen.getByRole('navigation', { name: 'Brødsmulesti' });
  expect(within(navigation).getAllByRole('listitem')).toHaveLength(3);
  expect(within(navigation).getAllByRole('link')).toHaveLength(2);
  const home = within(navigation).getByRole('link', { name: 'Hjem' });
  const components = within(navigation).getByRole('link', {
    name: 'Komponenter',
  });
  expect(home).toHaveAttribute('href', '/');
  expect(components).toHaveAttribute('href', '/komponenter');
  expect(home).not.toHaveAttribute('aria-current');
  expect(components).not.toHaveAttribute('aria-current');
  expect(within(navigation).getByText('Breadcrumbs')).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(
    within(navigation).queryByRole('link', { name: 'Breadcrumbs' }),
  ).not.toBeInTheDocument();
  await user.tab();
  expect(home).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onNavigate).toHaveBeenCalledTimes(1);
  await user.tab();
  expect(components).toHaveFocus();
  await user.click(components);
  expect(onNavigate).toHaveBeenCalledTimes(2);
});
