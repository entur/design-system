import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Template } from '..';
import { useSidebarCollapsed } from '../SidebarContext';

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
  expect(portal.style.getPropertyValue('--grid-template-columns')).toBe(
    'var(--eds-sidebar-width, min-content) minmax(0, 1fr)',
  );
  expect(portal.style.getPropertyValue('--grid-gap')).toBe('0');
  expect(portal.style.getPropertyValue('--grid-column-gap')).toBe('var(--m)');

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

test('Sidebar without collapsible has no toggle button', () => {
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

test('Collapsible sidebar renders toggle button', () => {
  const { getByRole } = render(
    <Template.Portal>
      <Template.Portal.Sidebar collapsible>
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

test('Uncontrolled collapsible sidebar toggles on click', () => {
  const { getByRole, getByTestId } = render(
    <Template.Portal>
      <Template.Portal.Sidebar collapsible data-testid="sidebar">
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

  expect(sidebar).toHaveClass('eds-layout-template-sidebar--collapsed');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveAttribute('aria-label', 'Åpne sidemeny');

  fireEvent.click(toggle);

  expect(sidebar).not.toHaveClass('eds-layout-template-sidebar--collapsed');
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(toggle).toHaveAttribute('aria-label', 'Lukk sidemeny');
});

test('Controlled collapsible sidebar respects collapsed prop and fires onCollapseToggle', () => {
  const onCollapseToggle = jest.fn();

  const { getByRole, getByTestId, rerender } = render(
    <Template.Portal>
      <Template.Portal.Sidebar
        collapsible
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
        collapsible
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

test('Collapsed sidebar sets --eds-sidebar-width inline style', () => {
  const { getByTestId, getByRole } = render(
    <Template.Portal>
      <Template.Portal.Sidebar collapsible data-testid="sidebar">
        <Template.Portal.Sidebar.Navigation>
          Nav
        </Template.Portal.Sidebar.Navigation>
      </Template.Portal.Sidebar>
      <Template.Portal.Main />
    </Template.Portal>,
  );

  const sidebar = getByTestId('sidebar');
  expect(sidebar.style.getPropertyValue('--eds-sidebar-width')).toBe('');

  fireEvent.click(getByRole('button'));
  expect(sidebar.style.getPropertyValue('--eds-sidebar-width')).toBe('2rem');
});

test('useSidebarCollapsed returns correct value inside collapsible sidebar children', () => {
  const CollapsedIndicator = () => {
    const { isCollapsed } = useSidebarCollapsed();
    return <span data-testid="indicator">{String(isCollapsed)}</span>;
  };

  const { getByTestId, getByRole } = render(
    <Template.Portal>
      <Template.Portal.Sidebar collapsible>
        <CollapsedIndicator />
      </Template.Portal.Sidebar>
      <Template.Portal.Main />
    </Template.Portal>,
  );

  expect(getByTestId('indicator').textContent).toBe('false');

  fireEvent.click(getByRole('button'));

  expect(getByTestId('indicator').textContent).toBe('true');
});
