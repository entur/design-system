import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describeComponentContract } from '../../../../../../tests/jest/componentContract';
import { Template } from '..';

describeComponentContract('Template.Portal', {
  render: props => <Template.Portal data-testid="portal" {...props} />,
  getElement: () => screen.getByTestId('portal'),
  baseClassName: 'eds-layout-template-portal',
  refElement: HTMLDivElement,
  as: 'section',
});

describeComponentContract('Template.Portal.StatusBar', {
  render: props => (
    <Template.Portal.StatusBar data-testid="status-bar" {...props} />
  ),
  getElement: () => screen.getByTestId('status-bar'),
  baseClassName: 'eds-layout-template-portal__status-bar',
  refElement: HTMLDivElement,
  as: 'header',
});

describeComponentContract('Template.Portal.Main', {
  render: props => <Template.Portal.Main data-testid="main" {...props} />,
  getElement: () => screen.getByTestId('main'),
  baseClassName: 'eds-layout-template-portal__main',
  refElement: HTMLElement,
  as: 'div',
});

describeComponentContract('Template.Portal.Sidebar', {
  render: props => <Template.Portal.Sidebar data-testid="sidebar" {...props} />,
  getElement: () => screen.getByTestId('sidebar'),
  baseClassName: 'eds-layout-template-sidebar',
  refElement: HTMLElement,
  as: 'div',
});

describeComponentContract('Collapsible Template.Portal.Sidebar', {
  render: props => (
    <Template.Portal.Sidebar
      data-testid="sidebar"
      collapsed={false}
      {...props}
    />
  ),
  getElement: () => screen.getByTestId('sidebar'),
  baseClassName: 'eds-layout-template-sidebar--collapsible',
  refElement: HTMLElement,
  as: 'div',
});

describeComponentContract('Template.Portal.Sidebar.Logo', {
  render: props => (
    <Template.Portal.Sidebar.Logo data-testid="logo" {...props} />
  ),
  getElement: () => screen.getByTestId('logo'),
  refElement: HTMLDivElement,
  as: 'a',
});

describeComponentContract('Template.Portal.Sidebar.User', {
  render: props => (
    <Template.Portal.Sidebar.User data-testid="user" {...props} />
  ),
  getElement: () => screen.getByTestId('user'),
  refElement: HTMLDivElement,
  as: 'section',
});

describeComponentContract('Template.Portal.Sidebar.Data', {
  render: props => (
    <Template.Portal.Sidebar.Data data-testid="data" {...props} />
  ),
  getElement: () => screen.getByTestId('data'),
  baseClassName: 'eds-layout-flex',
  refElement: HTMLDivElement,
  as: 'dl',
});

describeComponentContract('Template.Portal.Sidebar.Navigation', {
  render: props => (
    <Template.Portal.Sidebar.Navigation data-testid="nav" {...props} />
  ),
  getElement: () => screen.getByTestId('nav'),
  baseClassName: 'eds-layout-template-sidebar__navigation',
  refElement: HTMLElement,
  as: 'div',
});

describeComponentContract('Template.Portal.Sidebar.Footer', {
  render: props => (
    <Template.Portal.Sidebar.Footer data-testid="footer" {...props} />
  ),
  getElement: () => screen.getByTestId('footer'),
  baseClassName: 'eds-layout-template-sidebar__footer',
  refElement: HTMLElement,
  as: 'div',
});

test('Template.Portal renders its sections with their default elements', () => {
  render(
    <Template.Portal>
      <Template.Portal.StatusBar data-testid="status-bar" />
      <Template.Portal.Sidebar data-testid="sidebar">
        <Template.Portal.Sidebar.Logo data-testid="logo" />
        <Template.Portal.Sidebar.Navigation data-testid="nav" />
        <Template.Portal.Sidebar.Footer data-testid="footer" />
      </Template.Portal.Sidebar>
      <Template.Portal.Main data-testid="main" />
    </Template.Portal>,
  );

  expect(screen.getByTestId('status-bar').tagName).toBe('DIV');
  expect(screen.getByTestId('sidebar').tagName).toBe('ASIDE');
  expect(screen.getByTestId('logo').tagName).toBe('DIV');
  expect(screen.getByTestId('nav').tagName).toBe('NAV');
  expect(screen.getByTestId('footer').tagName).toBe('FOOTER');
  expect(screen.getByTestId('main').tagName).toBe('MAIN');
});

test('Template.Portal sets its grid gaps inline and leaves template columns to CSS', () => {
  render(<Template.Portal data-testid="portal" />);

  const portal = screen.getByTestId('portal');
  expect(portal).toHaveClass('eds-layout-grid');
  // --grid-template-columns-base is set via Portal.scss, not as an inline style,
  // so the Grid does not override it with a default value.
  expect(
    portal.style.getPropertyValue('--grid-template-columns-base'),
  ).toBeFalsy();
  expect(portal.style.getPropertyValue('--grid-gap-base')).toBe('0');
  expect(portal.style.getPropertyValue('--grid-column-gap-base')).toBe(
    'var(--m)',
  );
});

test('Template.Portal.StatusBar spans the full grid width', () => {
  render(<Template.Portal.StatusBar data-testid="status-bar" />);

  const statusBar = screen.getByTestId('status-bar');
  expect(statusBar.style.getPropertyValue('--grid-item-col-start-base')).toBe(
    '1',
  );
  expect(statusBar.style.getPropertyValue('--grid-item-col-end-base')).toBe(
    '-1',
  );
});

test('Sidebar wraps itself in contrast unless contrast is false', () => {
  const { rerender } = render(
    <Template.Portal.Sidebar data-testid="sidebar" />,
  );
  const sidebar = screen.getByTestId('sidebar');
  expect(sidebar.parentElement).toHaveClass('eds-contrast');
  expect(sidebar).not.toHaveClass('eds-layout-template-sidebar--plain');

  rerender(<Template.Portal.Sidebar data-testid="sidebar" contrast={false} />);
  expect(screen.getByTestId('sidebar').parentElement).not.toHaveClass(
    'eds-contrast',
  );
  expect(screen.getByTestId('sidebar')).toHaveClass(
    'eds-layout-template-sidebar--plain',
  );
});

test('Collapsed sidebar adds the collapsed class and keeps consumer style', () => {
  const { rerender } = render(
    <Template.Portal.Sidebar
      data-testid="sidebar"
      collapsed={false}
      style={{ marginTop: '7px' }}
    />,
  );
  const sidebar = screen.getByTestId('sidebar');
  expect(sidebar).not.toHaveClass('eds-layout-template-sidebar--collapsed');
  expect(sidebar.style.getPropertyValue('--eds-sidebar-width')).toBe('');

  rerender(
    <Template.Portal.Sidebar
      data-testid="sidebar"
      collapsed={true}
      style={{ marginTop: '7px' }}
    />,
  );
  expect(sidebar).toHaveClass('eds-layout-template-sidebar--collapsed');
  expect(sidebar.style.getPropertyValue('--eds-sidebar-width')).toBe('2rem');
  expect(sidebar).toHaveStyle({ marginTop: '7px' });
});

test('Sidebar.Data renders as Flex column with gap', () => {
  render(<Template.Portal.Sidebar.Data data-testid="data" />);

  const data = screen.getByTestId('data');
  expect(data.style.getPropertyValue('--flex-direction-base')).toBe('column');
  expect(data.style.getPropertyValue('--flex-gap-base')).toBe('var(--s)');
});

test('Template.Portal composes navigation and main landmarks', () => {
  render(
    <Template.Portal>
      <Template.Portal.Sidebar aria-label="Journey tools">
        <Template.Portal.Sidebar.Logo>
          <a href="/">Entur</a>
        </Template.Portal.Sidebar.Logo>
        <Template.Portal.Sidebar.Navigation aria-label="Journeys">
          <a href="/journeys">Find a journey</a>
        </Template.Portal.Sidebar.Navigation>
      </Template.Portal.Sidebar>
      <Template.Portal.Main>
        <h1>Your journeys</h1>
      </Template.Portal.Main>
    </Template.Portal>,
  );

  const sidebar = screen.getByRole('complementary', { name: 'Journey tools' });
  expect(within(sidebar).getByRole('link', { name: 'Entur' })).toHaveAttribute(
    'href',
    '/',
  );
  const navigation = within(sidebar).getByRole('navigation', {
    name: 'Journeys',
  });
  expect(
    within(navigation).getByRole('link', { name: 'Find a journey' }),
  ).toHaveAttribute('href', '/journeys');
  expect(
    within(screen.getByRole('main')).getByRole('heading', {
      level: 1,
      name: 'Your journeys',
    }),
  ).toBeInTheDocument();
});

test('Template.Portal.StatusBar can announce environment changes', () => {
  render(
    <Template.Portal>
      <Template.Portal.StatusBar role="status">
        Environment indicator
      </Template.Portal.StatusBar>
      <Template.Portal.Sidebar />
      <Template.Portal.Main />
    </Template.Portal>,
  );

  expect(screen.getByRole('status')).toHaveTextContent('Environment indicator');
});

test('Sidebar without collapsed prop has no toggle button', () => {
  const { queryByRole } = render(
    <Template.Portal>
      <Template.Portal.Sidebar>
        <Template.Portal.Sidebar.Navigation>
          Nav
        </Template.Portal.Sidebar.Navigation>
      </Template.Portal.Sidebar>
      <Template.Portal.Main />
    </Template.Portal>,
  );

  expect(queryByRole('button')).toBeNull();
});

test('Controlled sidebar reports keyboard toggles and waits for the parent to update', async () => {
  const user = userEvent.setup();
  const onCollapseToggle = jest.fn();

  const { getByRole, rerender } = render(
    <Template.Portal>
      <Template.Portal.Sidebar
        collapsed={false}
        onCollapseToggle={onCollapseToggle}
      >
        <Template.Portal.Sidebar.Navigation>
          Nav content
        </Template.Portal.Sidebar.Navigation>
      </Template.Portal.Sidebar>
      <Template.Portal.Main />
    </Template.Portal>,
  );

  const toggle = getByRole('button', { name: 'Lukk sidemeny' });
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await user.tab();
  expect(toggle).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onCollapseToggle).toHaveBeenCalledTimes(1);
  expect(onCollapseToggle).toHaveBeenNthCalledWith(1, true);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');

  rerender(
    <Template.Portal>
      <Template.Portal.Sidebar
        collapsed={true}
        onCollapseToggle={onCollapseToggle}
      >
        <Template.Portal.Sidebar.Navigation>
          Nav content
        </Template.Portal.Sidebar.Navigation>
      </Template.Portal.Sidebar>
      <Template.Portal.Main />
    </Template.Portal>,
  );

  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveAccessibleName('Åpne sidemeny');
  expect(toggle).toHaveFocus();
  await user.keyboard(' ');
  expect(onCollapseToggle).toHaveBeenCalledTimes(2);
  expect(onCollapseToggle).toHaveBeenNthCalledWith(2, false);
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('Sidebar uses custom toggle labels and does not submit a surrounding form', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn(event => event.preventDefault());
  const onCollapseToggle = jest.fn();
  const sidebar = (collapsed: boolean) => (
    <form onSubmit={onSubmit}>
      <Template.Portal.Sidebar
        collapsed={collapsed}
        onCollapseToggle={onCollapseToggle}
        openSidebarAriaLabel="Show navigation"
        closeSidebarAriaLabel="Hide navigation"
      />
    </form>
  );
  const { rerender } = render(sidebar(true));
  await user.click(screen.getByRole('button', { name: 'Show navigation' }));
  expect(onCollapseToggle).toHaveBeenCalledWith(false);
  expect(onSubmit).not.toHaveBeenCalled();
  rerender(sidebar(false));
  expect(
    screen.getByRole('button', { name: 'Hide navigation' }),
  ).toHaveAttribute('aria-expanded', 'true');
});

test('Collapsed sidebar without onCollapseToggle has no toggle button', () => {
  render(
    <Template.Portal>
      <Template.Portal.Sidebar collapsed={true}>
        <Template.Portal.Sidebar.Navigation>
          Nav
        </Template.Portal.Sidebar.Navigation>
      </Template.Portal.Sidebar>
      <Template.Portal.Main />
    </Template.Portal>,
  );

  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
