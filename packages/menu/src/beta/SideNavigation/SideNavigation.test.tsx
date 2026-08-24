import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import '@testing-library/jest-dom';

import { SideNavigation } from '.';

describe('SideNavigation (beta)', () => {
  it('renders its items in a list', () => {
    render(
      <SideNavigation>
        <SideNavigation.Item href="/a">Første</SideNavigation.Item>
        <SideNavigation.Item href="/b">Andre</SideNavigation.Item>
      </SideNavigation>,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Første').closest('a')).toHaveAttribute(
      'href',
      '/a',
    );
  });

  it('marks the active item with aria-current', () => {
    render(
      <SideNavigation>
        <SideNavigation.Item href="/a" active>
          Aktiv
        </SideNavigation.Item>
        <SideNavigation.Item href="/b">Inaktiv</SideNavigation.Item>
      </SideNavigation>,
    );

    expect(screen.getByRole('link', { name: 'Aktiv' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Inaktiv' })).not.toHaveAttribute(
      'aria-current',
    );
  });

  it('renders a disabled item as a disabled button', () => {
    render(
      <SideNavigation>
        <SideNavigation.Item href="/a" target="_blank" rel="noopener" disabled>
          Deaktivert
        </SideNavigation.Item>
      </SideNavigation>,
    );

    const item = screen.getByRole('button', { name: 'Deaktivert' });
    expect(item).toBeDisabled();
    expect(item).toHaveAttribute('aria-disabled', 'true');
    expect(item).toHaveAttribute('type', 'button');
    // Anchor-only props would be invalid attributes on a <button>
    expect(item).not.toHaveAttribute('href');
    expect(item).not.toHaveAttribute('target');
    expect(item).not.toHaveAttribute('rel');
  });

  it('gives an item rendered as a button an explicit type', () => {
    render(
      <SideNavigation>
        <SideNavigation.Item as="button">Knapp</SideNavigation.Item>
      </SideNavigation>,
    );

    const item = screen.getByRole('button', { name: 'Knapp' });
    expect(item).toHaveAttribute('type', 'button');
    expect(item).not.toBeDisabled();
  });

  it('renders the badge and the alert dot', () => {
    render(
      <SideNavigation>
        <SideNavigation.Item href="/a" badge={<span>Ny</span>} alert>
          Med merke
        </SideNavigation.Item>
      </SideNavigation>,
    );

    expect(screen.getByText('Ny')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Varsel' })).toBeInTheDocument();
  });

  it('labels the group list with its title', () => {
    render(
      <SideNavigation>
        <SideNavigation.Group title="Gruppenavn">
          <SideNavigation.Item href="/a">Første</SideNavigation.Item>
        </SideNavigation.Group>
      </SideNavigation>,
    );

    expect(screen.getByText('Gruppenavn')).toBeInTheDocument();
    expect(
      screen.getByRole('list', { name: 'Gruppenavn' }),
    ).toBeInTheDocument();
  });
});

describe('SideNavigation.ExpandableItem (beta)', () => {
  it('is closed by default and toggles on click', async () => {
    const user = userEvent.setup();
    render(
      <SideNavigation>
        <SideNavigation.ExpandableItem title="Utvidbar">
          <SideNavigation.Item href="/a">Underelement</SideNavigation.Item>
        </SideNavigation.ExpandableItem>
      </SideNavigation>,
    );

    const trigger = screen.getByRole('button', { name: /Utvidbar/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('points aria-controls at the submenu panel', () => {
    render(
      <SideNavigation>
        <SideNavigation.ExpandableItem title="Utvidbar" defaultOpen>
          <SideNavigation.Item href="/a">Underelement</SideNavigation.Item>
        </SideNavigation.ExpandableItem>
      </SideNavigation>,
    );

    const trigger = screen.getByRole('button', { name: /Utvidbar/ });
    const panelId = trigger.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId as string)).toContainElement(
      screen.getByText('Underelement'),
    );
  });

  it('opens itself when a descendant is active', () => {
    render(
      <SideNavigation>
        <SideNavigation.ExpandableItem title="Utvidbar">
          <SideNavigation.Item href="/a">Inaktiv</SideNavigation.Item>
          <SideNavigation.Item href="/b" active>
            Aktiv
          </SideNavigation.Item>
        </SideNavigation.ExpandableItem>
      </SideNavigation>,
    );

    expect(screen.getByRole('button', { name: /Utvidbar/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('marks an expandable item whose submenu holds the active page', async () => {
    const user = userEvent.setup();
    render(
      <SideNavigation>
        <SideNavigation.ExpandableItem title="Utvidbar">
          <SideNavigation.Item href="/a" active>
            Aktiv
          </SideNavigation.Item>
        </SideNavigation.ExpandableItem>
      </SideNavigation>,
    );

    // Opened by the active descendant, so the label is bold but --open keeps
    // the background off
    const trigger = screen.getByRole('button', { name: /Utvidbar/ });
    expect(trigger).toHaveClass(
      'eds-side-navigation-beta__click-target--active',
      'eds-side-navigation-beta__click-target--open',
    );
    // The submenu is the one row that is the active page
    expect(trigger).not.toHaveAttribute('aria-current');

    await user.click(trigger);

    expect(trigger).toHaveClass(
      'eds-side-navigation-beta__click-target--active',
    );
    expect(trigger).not.toHaveClass(
      'eds-side-navigation-beta__click-target--open',
    );
  });

  it('keeps the bold label on an active expandable item while it is open', async () => {
    const user = userEvent.setup();
    render(
      <SideNavigation>
        <SideNavigation.ExpandableItem title="Utvidbar" active>
          <SideNavigation.Item href="/a">Underelement</SideNavigation.Item>
        </SideNavigation.ExpandableItem>
      </SideNavigation>,
    );

    const trigger = screen.getByRole('button', { name: /Utvidbar/ });
    expect(trigger).toHaveClass(
      'eds-side-navigation-beta__click-target--active',
    );
    expect(trigger).not.toHaveClass(
      'eds-side-navigation-beta__click-target--open',
    );

    await user.click(trigger);

    // Still the current page, so still bold — --open resets the background the
    // same class would otherwise draw
    expect(trigger).toHaveClass(
      'eds-side-navigation-beta__click-target--active',
      'eds-side-navigation-beta__click-target--open',
    );
    expect(trigger).toHaveAttribute('aria-current', 'page');
  });

  it('respects the open prop and reports changes through onOpenChange', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    render(
      <SideNavigation>
        <SideNavigation.ExpandableItem
          title="Utvidbar"
          open={false}
          onOpenChange={onOpenChange}
        >
          <SideNavigation.Item href="/a">Underelement</SideNavigation.Item>
        </SideNavigation.ExpandableItem>
      </SideNavigation>,
    );

    const trigger = screen.getByRole('button', { name: /Utvidbar/ });
    await user.click(trigger);

    expect(onOpenChange).toHaveBeenCalledWith(true);
    // Controlled: the state does not change unless the parent updates it
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('discards a stored toggle when the active descendant changes', async () => {
    const user = userEvent.setup();
    const Menu = ({ activeChild }: { activeChild: boolean }) => (
      <SideNavigation>
        <SideNavigation.ExpandableItem title="Utvidbar">
          <SideNavigation.Item href="/a" active={activeChild}>
            Underelement
          </SideNavigation.Item>
        </SideNavigation.ExpandableItem>
      </SideNavigation>
    );

    const { rerender } = render(<Menu activeChild={false} />);
    const trigger = screen.getByRole('button', { name: /Utvidbar/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    // The user opens the menu manually
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    // Navigating away: the user's toggle holds until the derived value itself
    // actually changes
    rerender(<Menu activeChild />);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    rerender(<Menu activeChild={false} />);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('SideNavigation (beta) server rendering', () => {
  const markup = (
    <SideNavigation>
      <SideNavigation.Group title="Gruppenavn">
        <SideNavigation.ExpandableItem title="Utvidbar">
          <SideNavigation.Item href="/b" active>
            Aktiv underside
          </SideNavigation.Item>
        </SideNavigation.ExpandableItem>
      </SideNavigation.Group>
    </SideNavigation>
  );

  it('renders the active submenu open in the server HTML', () => {
    const html = renderToString(markup);

    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('Aktiv underside');
  });

  it('hydrates the server HTML without mismatches', () => {
    const container = document.createElement('div');
    container.innerHTML = renderToString(markup);
    document.body.appendChild(container);

    const errors: unknown[] = [];
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation((...args) => {
        errors.push(args[0]);
      });

    act(() => {
      hydrateRoot(container, markup);
    });

    consoleError.mockRestore();
    expect(errors).toHaveLength(0);
    document.body.removeChild(container);
  });
});
