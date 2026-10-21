import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button, PrimaryButton, SecondaryButton } from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

test('activates a named button with mouse, Enter and Space', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(
    <Button variant="primary" onClick={onClick}>
      Save
    </Button>,
  );
  const button = screen.getByRole('button', { name: 'Save' });

  await user.tab();
  expect(button).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
  await user.keyboard(' ');
  expect(onClick).toHaveBeenCalledTimes(2);
  await user.click(button);
  expect(onClick).toHaveBeenCalledTimes(3);
});

test('disabled buttons cannot activate or receive focus until enabled', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  const { rerender } = render(
    <Button variant="primary" disabled onClick={onClick}>
      Save
    </Button>,
  );
  const button = screen.getByRole('button', { name: 'Save' });

  expect(button).toBeDisabled();
  expect(button).toHaveAttribute('aria-disabled', 'true');
  await user.click(button);
  await user.tab();
  expect(button).not.toHaveFocus();
  await user.keyboard('{Enter} ');
  expect(onClick).not.toHaveBeenCalled();

  rerender(
    <Button variant="primary" onClick={onClick}>
      Save
    </Button>,
  );
  expect(button).toBeEnabled();
  await user.tab();
  expect(button).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
});

test.each([
  {
    name: 'Button',
    renderLink: (onClick: () => void) => (
      <Button variant="primary" as="a" href="#tickets" onClick={onClick}>
        Tickets
      </Button>
    ),
  },
  {
    name: 'PrimaryButton',
    renderLink: (onClick: () => void) => (
      <PrimaryButton as="a" href="#tickets" onClick={onClick}>
        Tickets
      </PrimaryButton>
    ),
  },
])(
  '$name links have a destination and activate by mouse and Enter',
  async ({ renderLink }) => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(renderLink(onClick));
    const link = screen.getByRole('link', { name: 'Tickets' });

    expect(link).toHaveAttribute('href', '#tickets');
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
    await user.click(link);
    expect(onClick).toHaveBeenCalledTimes(2);
  },
);

test('button type controls submission and resetting form values', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn(event => event.preventDefault());
  render(
    <form onSubmit={onSubmit}>
      <label>
        Name
        <input defaultValue="Original" />
      </label>
      <Button variant="secondary" type="button">
        Preview
      </Button>
      <Button variant="secondary" type="reset">
        Reset
      </Button>
      <Button variant="primary">Save</Button>
      <PrimaryButton type="submit">Confirm</PrimaryButton>
    </form>,
  );

  await user.click(screen.getByRole('button', { name: 'Preview' }));
  expect(onSubmit).not.toHaveBeenCalled();
  const input = screen.getByRole('textbox', { name: 'Name' });
  await user.clear(input);
  await user.type(input, 'Changed');
  await user.click(screen.getByRole('button', { name: 'Reset' }));
  expect(input).toHaveValue('Original');
  expect(onSubmit).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: 'Save' }));
  expect(onSubmit).toHaveBeenCalledTimes(1);
  await user.click(screen.getByRole('button', { name: 'Confirm' }));
  expect(onSubmit).toHaveBeenCalledTimes(2);
});

test('loading preserves the text name and announces busy state until complete', () => {
  const { rerender } = render(
    <PrimaryButton loading>
      <svg aria-hidden="true" />
      Save ticket
    </PrimaryButton>,
  );
  const button = screen.getByRole('button', { name: 'Save ticket' });
  expect(button).toHaveAttribute('aria-busy', 'true');

  rerender(<PrimaryButton loading={false}>Save ticket</PrimaryButton>);
  expect(button).toHaveAccessibleName('Save ticket');
  expect(button).toHaveAttribute('aria-busy', 'false');
  expect(button).toHaveTextContent('Save ticket');
});

test('an explicit accessible name survives loading and disabled state', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(
    <Button
      variant="primary"
      aria-label="Save ticket"
      loading
      disabled
      onClick={onClick}
    >
      <svg aria-hidden="true" />
    </Button>,
  );
  const button = screen.getByRole('button', { name: 'Save ticket' });
  expect(button).toHaveAttribute('aria-busy', 'true');
  expect(button).toBeDisabled();
  await user.click(button);
  await user.tab();
  expect(button).not.toHaveFocus();
  await user.keyboard('{Enter} ');
  expect(onClick).not.toHaveBeenCalled();
});

test('leading and trailing icons select their modifier classes only next to text', () => {
  const destination = 'Bergen';
  const { rerender } = render(
    <Button variant="primary">
      <svg aria-hidden="true" /> Til {destination}
    </Button>,
  );
  const button = screen.getByRole('button');
  expect(button).toHaveClass('eds-button--leading-icon');
  expect(button).not.toHaveClass('eds-button--trailing-icon');

  rerender(
    <Button variant="primary">
      Til {destination} <svg aria-hidden="true" />
    </Button>,
  );
  expect(button).not.toHaveClass('eds-button--leading-icon');
  expect(button).toHaveClass('eds-button--trailing-icon');

  rerender(<Button variant="primary">Til {destination}</Button>);
  expect(button).not.toHaveClass(
    'eds-button--leading-icon',
    'eds-button--trailing-icon',
  );

  rerender(
    <Button variant="primary" aria-label="Til Bergen">
      <svg aria-hidden="true" />
    </Button>,
  );
  expect(button).not.toHaveClass(
    'eds-button--leading-icon',
    'eds-button--trailing-icon',
  );
});

test('variant, size, width and loading select their modifier classes', () => {
  const { rerender } = render(<Button variant="primary">Save</Button>);
  const button = screen.getByRole('button', { name: 'Save' });
  expect(button).toHaveClass(
    'eds-button',
    'eds-button--variant-primary',
    'eds-button--size-medium',
  );
  expect(button).not.toHaveClass(
    'eds-button--width-fluid',
    'eds-button--loading',
  );

  rerender(
    <Button variant="negative" size="large" width="fluid" loading>
      Save
    </Button>,
  );
  expect(button).toHaveClass(
    'eds-button--variant-negative',
    'eds-button--size-large',
    'eds-button--width-fluid',
    'eds-button--loading',
  );
  expect(button).not.toHaveClass('eds-button--variant-primary');
});

test('variant components apply their own variant', () => {
  render(
    <>
      <PrimaryButton>Save</PrimaryButton>
      <SecondaryButton size="large">Cancel</SecondaryButton>
    </>,
  );
  expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
    'eds-button--variant-primary',
  );
  expect(screen.getByRole('button', { name: 'Cancel' })).toHaveClass(
    'eds-button--variant-secondary',
    'eds-button--size-large',
  );
});

describeComponentContract('Button', {
  render: props => (
    <Button variant="primary" {...props}>
      Save
    </Button>
  ),
  getElement: () => screen.getByText('Save'),
  baseClassName: 'eds-button',
  refElement: HTMLButtonElement,
  as: 'a',
});

describeComponentContract('PrimaryButton', {
  render: props => <PrimaryButton {...props}>Save</PrimaryButton>,
  getElement: () => screen.getByText('Save'),
  baseClassName: 'eds-button',
  refElement: HTMLButtonElement,
  as: 'a',
});

// Bug: loading derives aria-label from direct string children, dropping nested text.
test.failing('loading preserves a name supplied by nested text', () => {
  const { rerender } = render(
    <Button variant="primary">
      <span>Save ticket</span>
    </Button>,
  );
  const button = screen.getByRole('button', { name: 'Save ticket' });

  rerender(
    <Button variant="primary" loading>
      <span>Save ticket</span>
    </Button>,
  );
  expect(button).toHaveAccessibleName('Save ticket');
});

// Bug: disabled anchors still dispatch clicks because native disabled only affects buttons.
test.failing.each(['mouse', 'keyboard'])(
  'disabled links do not activate by %s',
  async input => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button
        variant="primary"
        as="a"
        href="#tickets"
        disabled
        onClick={onClick}
      >
        Tickets
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Tickets' });
    expect(link).toHaveAttribute('aria-disabled', 'true');

    if (input === 'mouse') {
      await user.click(link);
    } else {
      await user.tab();
      await user.keyboard('{Enter}');
    }
    expect(onClick).not.toHaveBeenCalled();
  },
);
