import { fireEvent, render } from '@testing-library/react';
import { Template } from '..';

test('Template.Portal renders expected regions and forwards props', () => {
  const { getByTestId, container } = render(
    <Template.Portal data-testid="portal">
      <Template.Portal.Sidebar data-testid="sidebar" className="sidebar-class">
        <Template.Portal.Sidebar.Logo
          data-testid="logo"
          className="logo-class"
        />
        <Template.Portal.Sidebar.Navigation
          data-testid="nav"
          className="nav-class"
        />
      </Template.Portal.Sidebar>
      <Template.Portal.Main data-testid="main" className="main-class" />
    </Template.Portal>,
  );

  const portal = getByTestId('portal');
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

  const sidebar = getByTestId('sidebar');
  expect(sidebar.tagName).toBe('ASIDE');
  expect(sidebar).toHaveClass('eds-layout-flex', 'sidebar-class');

  const contrast = container.querySelector('.eds-contrast');
  expect(contrast).toBeTruthy();

  const logo = getByTestId('logo');
  expect(logo.tagName).toBe('DIV');
  expect(logo).toHaveClass('logo-class');

  const nav = getByTestId('nav');
  expect(nav.tagName).toBe('NAV');
  expect(nav).toHaveClass('nav-class');

  const main = getByTestId('main');
  expect(main.tagName).toBe('MAIN');
  expect(main).toHaveClass('main-class');
});

test('Template.Portal.StatusBar renders and spans full width', () => {
  const { getByTestId } = render(
    <Template.Portal data-testid="portal">
      <Template.Portal.StatusBar data-testid="status-bar" className="custom">
        Environment indicator
      </Template.Portal.StatusBar>
      <Template.Portal.Sidebar />
      <Template.Portal.Main />
    </Template.Portal>,
  );

  const statusBar = getByTestId('status-bar');
  expect(statusBar.tagName).toBe('DIV');
  expect(statusBar).toHaveClass(
    'eds-layout-template-portal__status-bar',
    'custom',
  );
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

test('Sidebar with collapsed prop renders toggle button', () => {
  const { getByRole } = render(
    <Template.Portal>
      <Template.Portal.Sidebar collapsed={false} onCollapseToggle={jest.fn()}>
        <Template.Portal.Sidebar.Navigation>
          Nav
        </Template.Portal.Sidebar.Navigation>
      </Template.Portal.Sidebar>
      <Template.Portal.Main />
    </Template.Portal>,
  );

  const toggle = getByRole('button');
  expect(toggle).toHaveClass('eds-layout-template-sidebar__collapse-toggle');
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(toggle).toHaveAttribute('aria-label', 'Lukk sidemeny');
});

test('Controlled collapsible sidebar respects collapsed prop and fires onCollapseToggle', () => {
  const onCollapseToggle = jest.fn();

  const { getByRole, getByTestId, rerender } = render(
    <Template.Portal>
      <Template.Portal.Sidebar
        collapsed={false}
        onCollapseToggle={onCollapseToggle}
        data-testid="sidebar"
      >
        <Template.Portal.Sidebar.Navigation>
          Nav content
        </Template.Portal.Sidebar.Navigation>
      </Template.Portal.Sidebar>
      <Template.Portal.Main />
    </Template.Portal>,
  );

  const sidebar = getByTestId('sidebar');
  expect(sidebar).not.toHaveClass('eds-layout-template-sidebar--collapsed');

  const toggle = getByRole('button');
  fireEvent.click(toggle);
  expect(onCollapseToggle).toHaveBeenCalledWith(true);

  rerender(
    <Template.Portal>
      <Template.Portal.Sidebar
        collapsed={true}
        onCollapseToggle={onCollapseToggle}
        data-testid="sidebar"
      >
        <Template.Portal.Sidebar.Navigation>
          Nav content
        </Template.Portal.Sidebar.Navigation>
      </Template.Portal.Sidebar>
      <Template.Portal.Main />
    </Template.Portal>,
  );

  expect(sidebar).toHaveClass('eds-layout-template-sidebar--collapsed');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('Sidebar.Data renders as Flex column with gap', () => {
  const { getByTestId } = render(
    <Template.Portal>
      <Template.Portal.Sidebar>
        <Template.Portal.Sidebar.Data data-testid="data">
          <div>Item 1</div>
          <div>Item 2</div>
        </Template.Portal.Sidebar.Data>
        <Template.Portal.Sidebar.Navigation>
          Nav
        </Template.Portal.Sidebar.Navigation>
      </Template.Portal.Sidebar>
      <Template.Portal.Main />
    </Template.Portal>,
  );

  const data = getByTestId('data');
  expect(data).toHaveClass('eds-layout-flex');
  expect(data.style.getPropertyValue('--flex-direction-base')).toBe('column');
  expect(data.style.getPropertyValue('--flex-gap-base')).toBe('var(--s)');
});

test('Collapsed sidebar sets --eds-sidebar-width inline style', () => {
  const { getByTestId } = render(
    <Template.Portal>
      <Template.Portal.Sidebar collapsed={true} data-testid="sidebar">
        <Template.Portal.Sidebar.Navigation>
          Nav
        </Template.Portal.Sidebar.Navigation>
      </Template.Portal.Sidebar>
      <Template.Portal.Main />
    </Template.Portal>,
  );

  const sidebar = getByTestId('sidebar');
  expect(sidebar.style.getPropertyValue('--eds-sidebar-width')).toBe('2rem');
});
