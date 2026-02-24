import React from 'react';
import { render } from '@testing-library/react';
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
