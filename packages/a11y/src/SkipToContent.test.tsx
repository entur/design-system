import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SkipToContent } from './SkipToContent';
import { VisuallyHidden } from './VisuallyHidden';

test('the default skip link is the first tab stop and activates with Enter', async () => {
  const user = userEvent.setup();
  render(
    <>
      <SkipToContent>Skip to content</SkipToContent>
      <nav aria-label="Primary">
        <a href="#contact">Contact</a>
      </nav>
      <main id="main-content" tabIndex={-1}>
        <h1>Journey planner</h1>
      </main>
    </>,
  );
  const link = screen.getByRole('link', { name: 'Skip to content' });
  expect(link).toHaveAttribute('href', `#${screen.getByRole('main').id}`);
  // Observe native link activation without relying on jsdom fragment navigation.
  const onActivate = jest.fn((event: MouseEvent) => event.preventDefault());
  link.addEventListener('click', onActivate);

  await user.tab();
  expect(link).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onActivate).toHaveBeenCalledTimes(1);
});

test('composed children name a skip link to a custom content target', () => {
  render(
    <>
      <SkipToContent mainId="journey-results">
        <span>Skip to</span> <VisuallyHidden>journey results</VisuallyHidden>
        <svg aria-hidden="true" />
      </SkipToContent>
      <main id="journey-results" tabIndex={-1}>
        <h1>Journey results</h1>
      </main>
    </>,
  );

  const link = screen.getByRole('link', { name: 'Skip to journey results' });
  expect(link).toHaveAttribute('href', `#${screen.getByRole('main').id}`);
});
