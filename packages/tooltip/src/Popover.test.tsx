import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Popover, PopoverCloseButton, PopoverContent, PopoverTrigger } from '.';

const popoverContents = (
  <>
    <PopoverTrigger>
      <button>Options</button>
    </PopoverTrigger>
    <PopoverContent>
      <label>
        Name
        <input />
      </label>
      <PopoverCloseButton>
        <button>Close options</button>
      </PopoverCloseButton>
    </PopoverContent>
  </>
);

test('the trigger opens and closes a non-modal dialog', async () => {
  const user = userEvent.setup();
  render(<Popover>{popoverContents}</Popover>);
  const trigger = screen.getByRole('button', { name: 'Options' });

  expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

  await user.click(trigger);
  const dialog = screen.getByRole('dialog');
  expect(dialog).toBeVisible();
  expect(dialog).toHaveAttribute('aria-modal', 'false');
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(within(dialog).getByRole('textbox', { name: 'Name' })).toBeVisible();

  await user.click(trigger);
  expect(dialog).not.toBeVisible();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('opens from the keyboard and closes with Escape from within the dialog', async () => {
  const user = userEvent.setup();
  render(<Popover>{popoverContents}</Popover>);

  await user.tab();
  expect(screen.getByRole('button', { name: 'Options' })).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(screen.getByRole('dialog')).toBeVisible();
  await user.tab();
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Options' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('keeps interactions inside open and dismisses on an outside pointer press', async () => {
  const user = userEvent.setup();
  render(
    <>
      <Popover>{popoverContents}</Popover>
      <p>Outside the popover</p>
    </>,
  );

  await user.click(screen.getByRole('button', { name: 'Options' }));
  await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada');
  expect(screen.getByRole('dialog')).toBeVisible();

  // Isolate mousedown: jsdom's subsequent blur supplies Document as relatedTarget.
  fireEvent.mouseDown(screen.getByText('Outside the popover'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Options' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('keeps focus movement inside open and closes when tabbing outside', async () => {
  const user = userEvent.setup();
  render(
    <>
      <Popover>{popoverContents}</Popover>
      <button>Next section</button>
    </>,
  );

  await user.click(screen.getByRole('button', { name: 'Options' }));
  await user.tab();
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Close options' })).toHaveFocus();
  expect(screen.getByRole('dialog')).toBeVisible();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Next section' })).toHaveFocus();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('returning focus to the trigger does not dismiss the dialog', async () => {
  const user = userEvent.setup();
  render(<Popover>{popoverContents}</Popover>);

  await user.click(screen.getByRole('button', { name: 'Options' }));
  await user.tab();
  expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus();
  await user.tab({ shift: true });
  expect(screen.getByRole('button', { name: 'Options' })).toHaveFocus();
  expect(screen.getByRole('dialog')).toBeVisible();
});

test('the composed close button dismisses without submitting a surrounding form', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn(event => event.preventDefault());
  render(
    <form onSubmit={onSubmit}>
      <Popover>{popoverContents}</Popover>
    </form>,
  );

  await user.click(screen.getByRole('button', { name: 'Options' }));
  expect(screen.getByRole('dialog')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Close options' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();
});

test('integrates with consumer-controlled state and trigger click handling', async () => {
  const user = userEvent.setup();
  const ControlledPopover = () => {
    const [showPopover, setShowPopover] = React.useState(false);
    return (
      <Popover showPopover={showPopover} setShowPopover={setShowPopover}>
        <PopoverTrigger>
          <button onClick={() => setShowPopover(open => !open)}>Options</button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverCloseButton>
            <button>Close options</button>
          </PopoverCloseButton>
        </PopoverContent>
      </Popover>
    );
  };
  render(<ControlledPopover />);
  const trigger = screen.getByRole('button', { name: 'Options' });

  await user.click(trigger);
  expect(screen.getByRole('dialog')).toBeVisible();
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await user.click(screen.getByRole('button', { name: 'Close options' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');

  await user.click(trigger);
  expect(screen.getByRole('dialog')).toBeVisible();
  await user.click(trigger);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('requests controlled dismissal and waits for the consumer to update state', async () => {
  const user = userEvent.setup();
  const setShowPopover = jest.fn();
  const { rerender } = render(
    <Popover showPopover setShowPopover={setShowPopover}>
      {popoverContents}
    </Popover>,
  );

  expect(screen.getByRole('dialog')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Close options' }));
  expect(setShowPopover).toHaveBeenCalledTimes(1);
  expect(setShowPopover).toHaveBeenCalledWith(false);
  expect(screen.getByRole('dialog')).toBeVisible();

  rerender(
    <Popover showPopover={false} setShowPopover={setShowPopover}>
      {popoverContents}
    </Popover>,
  );
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Options' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
});

test('PopoverContent merges className, style and ref onto the dialog', () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <Popover>
      <PopoverTrigger>
        <button>Options</button>
      </PopoverTrigger>
      <PopoverContent
        ref={ref}
        className="consumer-class"
        style={{ marginTop: '7px' }}
      >
        Innhold
      </PopoverContent>
    </Popover>,
  );
  const dialog = screen.getByRole('dialog', { hidden: true });
  expect(dialog).toHaveClass('consumer-class', 'eds-popover');
  expect(dialog).toHaveStyle({ marginTop: '7px' });
  expect(ref.current).toBe(dialog);
});

test('Popover uses fixed positioning', async () => {
  const user = userEvent.setup();
  render(<Popover>{popoverContents}</Popover>);

  await user.click(screen.getByRole('button', { name: 'Options' }));

  expect(screen.getByRole('dialog')).toHaveStyle({ position: 'fixed' });
});
