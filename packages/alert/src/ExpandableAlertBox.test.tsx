import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  BannerExpandableAlertBox,
  SmallExpandableAlertBox,
} from './ExpandableAlertBox';
import { describeComponentContract } from '../../../tests/jest/componentContract';
import {
  expectCollapsed,
  expectExpanded,
} from '../../../tests/jest/disclosure';

test('opens and closes a small alert with custom labels using the mouse', async () => {
  const user = userEvent.setup();
  render(
    <SmallExpandableAlertBox
      variant="information"
      title="Endret avgang"
      openLabel="Vis detaljer"
      closeLabel="Skjul detaljer"
    >
      <a href="/departures">Se avganger</a>
    </SmallExpandableAlertBox>,
  );

  expect(screen.getByText('Endret avgang')).toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: 'Se avganger' }),
  ).not.toBeInTheDocument();
  const hiddenLink = screen.getByRole('link', {
    name: 'Se avganger',
    hidden: true,
  });
  expectCollapsed(hiddenLink);

  await user.click(screen.getByRole('button', { name: 'Vis detaljer' }));
  expect(
    await screen.findByRole('link', { name: 'Se avganger' }),
  ).toBeInTheDocument();
  expectExpanded(hiddenLink);

  await user.click(screen.getByRole('button', { name: 'Skjul detaljer' }));
  expect(
    screen.queryByRole('link', { name: 'Se avganger' }),
  ).not.toBeInTheDocument();
  expectCollapsed(hiddenLink);
  expect(screen.getByRole('button', { name: 'Vis detaljer' })).toHaveFocus();
});

test('opens a banner with Enter, reaches its content and collapses with Space', async () => {
  const user = userEvent.setup();
  render(
    <BannerExpandableAlertBox variant="warning" title="Endret avgang">
      <a href="/departures">Se avganger</a>
    </BannerExpandableAlertBox>,
  );

  await user.tab();
  const toggle = screen.getByRole('button', { name: 'Les mer' });
  expect(toggle).toHaveFocus();
  await user.keyboard('{Enter}');
  const link = await screen.findByRole('link', { name: 'Se avganger' });
  expect(screen.getByRole('button', { name: 'Lukk' })).toHaveFocus();
  await user.tab();
  expect(link).toHaveFocus();
  await user.tab({ shift: true });
  expect(toggle).toHaveFocus();
  await user.keyboard(' ');

  expect(
    screen.queryByRole('link', { name: 'Se avganger' }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Les mer' })).toHaveFocus();
  expectCollapsed(link);
});

// Bug: ExpandableAlertBoxTitle never sets aria-expanded on its toggle button.
test.failing(
  'exposes the expansion state to assistive technology',
  async () => {
    const user = userEvent.setup();
    render(
      <SmallExpandableAlertBox variant="information" title="Endret avgang">
        Detaljer om avgangen
      </SmallExpandableAlertBox>,
    );
    const toggle = screen.getByRole('button', { name: 'Les mer' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  },
);

describe.each([
  ['SmallExpandableAlertBox', SmallExpandableAlertBox, 'small'],
  ['BannerExpandableAlertBox', BannerExpandableAlertBox, 'banner'],
] as const)('%s', (name, AlertBox, size) => {
  const getAlertBox = () =>
    screen.getByRole('img', { name: 'Infomelding' }).parentElement!;

  describeComponentContract(name, {
    render: props => (
      <AlertBox variant="information" title="Endret avgang" {...props}>
        Detaljer
      </AlertBox>
    ),
    getElement: getAlertBox,
    baseClassName: 'eds-expandable-alert-box',
  });

  test('applies the alert box size modifier', () => {
    render(
      <AlertBox variant="information" title="Endret avgang">
        Detaljer
      </AlertBox>,
    );
    expect(getAlertBox()).toHaveClass(
      'eds-alert-box',
      `eds-alert-box--${size}`,
    );
  });
});
