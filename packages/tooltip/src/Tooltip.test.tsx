import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tooltip } from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  cleanup();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

const advanceTime = async (milliseconds: number) => {
  await act(async () => {
    jest.advanceTimersByTime(milliseconds);
  });
};

test('shows and hides an accessible description after the default hover delays', async () => {
  const user = userEvent.setup({ advanceTimers: advanceTime });
  render(
    <Tooltip content="Save your changes" placement="bottom">
      <button>Save</button>
    </Tooltip>,
  );
  const trigger = screen.getByRole('button', { name: 'Save' });

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(trigger).not.toHaveAccessibleDescription();

  await user.hover(trigger);
  await advanceTime(149);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  await advanceTime(1);
  const tooltip = screen.getByRole('tooltip');
  expect(tooltip).toBeVisible();
  expect(tooltip).toHaveTextContent('Save your changes');
  expect(trigger).toHaveAccessibleDescription('Save your changes');

  await user.unhover(trigger);
  await advanceTime(299);
  expect(tooltip).toBeVisible();
  await advanceTime(1);
  expect(tooltip).not.toBeVisible();
  expect(trigger).not.toHaveAccessibleDescription();
});

test('cancels a pending hover opening when the pointer leaves early', async () => {
  const user = userEvent.setup({ advanceTimers: advanceTime });
  render(
    <Tooltip
      content="Save your changes"
      placement="bottom"
      hoverDelay={{ enter: 200, leave: 400 }}
    >
      <button>Save</button>
    </Tooltip>,
  );
  const trigger = screen.getByRole('button', { name: 'Save' });

  await user.hover(trigger);
  await advanceTime(199);
  await user.unhover(trigger);
  await advanceTime(1);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  await advanceTime(400);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('stays visible while moving the pointer from the trigger onto the tooltip', async () => {
  const user = userEvent.setup({ advanceTimers: advanceTime });
  render(
    <Tooltip
      content="Save your changes"
      placement="bottom"
      hoverDelay={{ enter: 20, leave: 40 }}
    >
      <button>Save</button>
    </Tooltip>,
  );

  await user.hover(screen.getByRole('button', { name: 'Save' }));
  await advanceTime(20);
  const tooltip = screen.getByRole('tooltip');
  await user.hover(tooltip);
  await advanceTime(40);
  expect(tooltip).toBeVisible();

  await user.unhover(tooltip);
  await advanceTime(39);
  expect(tooltip).toBeVisible();
  await advanceTime(1);
  expect(tooltip).not.toBeVisible();
});

test('describes a keyboard-focused trigger and hides on blur', async () => {
  const user = userEvent.setup({ advanceTimers: advanceTime });
  render(
    <>
      <Tooltip content="Save your changes" placement="bottom">
        <button>Save</button>
      </Tooltip>
      <button>Next</button>
    </>,
  );
  const trigger = screen.getByRole('button', { name: 'Save' });

  await user.tab();
  expect(trigger).toHaveFocus();
  expect(screen.getByRole('tooltip')).toBeVisible();
  expect(trigger).toHaveAccessibleDescription('Save your changes');

  await user.tab();
  expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(trigger).not.toHaveAccessibleDescription();
});

test('dismisses with Escape when the keyboard listener is enabled', async () => {
  const user = userEvent.setup({ advanceTimers: advanceTime });
  render(
    <Tooltip
      content="Save your changes"
      placement="bottom"
      disableKeyboardListener={false}
    >
      <button>Save</button>
    </Tooltip>,
  );

  await user.tab();
  expect(screen.getByRole('tooltip')).toBeVisible();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
  expect(
    screen.getByRole('button', { name: 'Save' }),
  ).not.toHaveAccessibleDescription();
});

test.each(['{Enter}', ' '])(
  'toggles with %s when the keyboard listener is enabled',
  async key => {
    const user = userEvent.setup({ advanceTimers: advanceTime });
    render(
      <Tooltip
        content="Save your changes"
        placement="bottom"
        disableFocusListener
        disableKeyboardListener={false}
      >
        <button>Save</button>
      </Tooltip>,
    );

    await user.tab();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await user.keyboard(key);
    expect(screen.getByRole('tooltip')).toBeVisible();
    await user.keyboard(key);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  },
);

test('can disable hover without disabling focus', async () => {
  const user = userEvent.setup({ advanceTimers: advanceTime });
  render(
    <Tooltip
      content="Save your changes"
      placement="bottom"
      disableHoverListener
    >
      <button>Save</button>
    </Tooltip>,
  );

  await user.hover(screen.getByRole('button', { name: 'Save' }));
  await advanceTime(150);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  await user.tab();
  expect(screen.getByRole('tooltip')).toBeVisible();
});

test('toggles on click when the click listener is enabled', async () => {
  const user = userEvent.setup({ advanceTimers: advanceTime });
  render(
    <Tooltip
      content="Save your changes"
      placement="bottom"
      disableHoverListener
      disableFocusListener
      disableClickListener={false}
    >
      <button>Save</button>
    </Tooltip>,
  );
  const trigger = screen.getByRole('button', { name: 'Save' });

  await user.click(trigger);
  expect(screen.getByRole('tooltip')).toBeVisible();
  await user.click(trigger);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});

test('follows isOpen updates instead of hover, focus, keyboard or click listeners', async () => {
  const user = userEvent.setup({ advanceTimers: advanceTime });
  const tooltip = (isOpen: boolean) => (
    <Tooltip
      content="Save your changes"
      placement="bottom"
      isOpen={isOpen}
      showCloseButton={false}
      disableKeyboardListener={false}
      disableClickListener={false}
    >
      <button>Save</button>
    </Tooltip>
  );
  const { rerender } = render(tooltip(false));
  const trigger = screen.getByRole('button', { name: 'Save' });

  await user.hover(trigger);
  await advanceTime(150);
  await user.tab();
  await user.keyboard('{Enter}');
  await user.click(trigger);
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

  rerender(tooltip(true));
  expect(await screen.findByRole('tooltip')).toBeVisible();
  expect(trigger).toHaveAccessibleDescription('Save your changes');
  expect(
    screen.queryByRole('button', { name: 'Lukk tooltip' }),
  ).not.toBeInTheDocument();

  await user.unhover(trigger);
  await advanceTime(300);
  await user.keyboard('{Escape}');
  await user.tab();
  expect(screen.getByRole('tooltip')).toBeVisible();

  rerender(tooltip(false));
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(trigger).not.toHaveAccessibleDescription();
});

test('the controlled close button dismisses the tooltip and notifies the consumer', async () => {
  const user = userEvent.setup({ advanceTimers: advanceTime });
  const onClickCloseButton = jest.fn();
  render(
    <Tooltip
      content="Save your changes"
      placement="bottom"
      isOpen
      onClickCloseButton={onClickCloseButton}
    >
      <button>Save</button>
    </Tooltip>,
  );

  expect(await screen.findByRole('tooltip')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Lukk tooltip' }));
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Save' }),
  ).not.toHaveAccessibleDescription();
  expect(onClickCloseButton).toHaveBeenCalledTimes(1);
});

test('the negative and error variants select the negative modifier class', () => {
  const { rerender } = render(
    <Tooltip content="Lagret" placement="bottom">
      <button>Lagre</button>
    </Tooltip>,
  );
  const tooltip = screen.getByRole('tooltip', { hidden: true });
  expect(tooltip).toHaveClass('eds-tooltip');
  expect(tooltip).not.toHaveClass('eds-tooltip--negative');

  rerender(
    <Tooltip content="Lagret" placement="bottom" variant="negative">
      <button>Lagre</button>
    </Tooltip>,
  );
  expect(tooltip).toHaveClass('eds-tooltip--negative');

  rerender(
    <Tooltip content="Lagret" placement="bottom" variant="error">
      <button>Lagre</button>
    </Tooltip>,
  );
  expect(tooltip).toHaveClass('eds-tooltip--negative');
});

describeComponentContract('Tooltip', {
  render: props => (
    <Tooltip content="Lagret" placement="bottom" {...props}>
      <button>Lagre</button>
    </Tooltip>
  ),
  getElement: () => screen.getByRole('tooltip', { hidden: true }),
  baseClassName: 'eds-tooltip',
});

test('Tooltip uses fixed positioning', () => {
  render(
    <Tooltip content="tooltipcontent" placement="bottom" isOpen>
      <span>Tooltip children</span>
    </Tooltip>,
  );

  expect(screen.getByRole('tooltip', { hidden: true })).toHaveStyle({
    position: 'fixed',
  });
});
