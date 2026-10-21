import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Stepper } from './Stepper';

const steps = ['Journey', 'Passengers', 'Payment', 'Receipt'];

test('announces the current step and updates the summary when it changes', () => {
  const { rerender } = render(<Stepper steps={steps} activeIndex={1} />);
  const list = screen.getByRole('list', {
    name: 'Stegindikator med 4 steg, du er på steg 2 Passengers,',
  });
  expect(within(list).getAllByRole('listitem')).toHaveLength(4);
  const current = screen.getByText('Steg 2 av 4, Passengers');
  expect(current.parentElement).toHaveAttribute('aria-current', 'step');
  expect(
    screen.getByText('Steg 1 av 4, Journey , fullført').parentElement,
  ).not.toHaveAttribute('aria-current');
  expect(screen.queryByRole('button')).not.toBeInTheDocument();

  rerender(<Stepper steps={steps} activeIndex={2} />);
  expect(list).toHaveAccessibleName(
    'Stegindikator med 4 steg, du er på steg 3 Payment,',
  );
  expect(current.parentElement).not.toHaveAttribute('aria-current');
  expect(
    screen.getByText('Steg 3 av 4, Payment').parentElement,
  ).toHaveAttribute('aria-current', 'step');
});

test('only completed steps are interactive and report their zero-based index', async () => {
  const user = userEvent.setup();
  const onStepClick = jest.fn();
  const onSubmit = jest.fn(event => event.preventDefault());
  render(
    <form onSubmit={onSubmit}>
      <Stepper
        steps={steps}
        activeIndex={2}
        interactive
        onStepClick={onStepClick}
      />
    </form>,
  );
  expect(screen.getAllByRole('button')).toHaveLength(2);
  const first = screen.getByRole('button', {
    name: 'Steg 1 av 4, Journey , fullført',
  });
  const second = screen.getByRole('button', {
    name: 'Steg 2 av 4, Passengers , fullført',
  });

  await user.tab();
  expect(first).toHaveFocus();
  await user.keyboard('{Enter}');
  await user.tab();
  expect(second).toHaveFocus();
  await user.keyboard(' ');
  await user.click(first);
  await user.click(screen.getByText('3. Payment'));
  await user.click(screen.getByText('4. Receipt'));
  expect(onStepClick.mock.calls).toEqual([[0], [1], [0]]);
  expect(onSubmit).not.toHaveBeenCalled();
  expect(
    screen.getByText('Steg 3 av 4, Payment').parentElement,
  ).toHaveAttribute('aria-current', 'step');
});

test('does not call onStepClick when interactive is false', async () => {
  const user = userEvent.setup();
  const onStepClick = jest.fn();
  render(<Stepper steps={steps} activeIndex={2} onStepClick={onStepClick} />);
  await user.click(screen.getByText('1. Journey'));
  expect(onStepClick).not.toHaveBeenCalled();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});

test('keeps localized step announcements when visible indices are hidden', () => {
  render(
    <Stepper
      steps={steps}
      activeIndex={1}
      interactive
      showStepperIndex={false}
      ariaLabelStep="Step"
      ariaLabelOf="of"
      ariaLabelCompleted="completed"
      ariaLabelSummary="Booking progress"
    />,
  );
  expect(
    screen.getByRole('list', { name: 'Booking progress' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Step 1 of 4, Journey , completed' }),
  ).toBeInTheDocument();
  expect(screen.getByText('Journey')).toHaveAttribute('aria-hidden', 'true');
  expect(screen.queryByText('1. Journey')).not.toBeInTheDocument();
  expect(
    screen.getByText('Step 2 of 4, Passengers').parentElement,
  ).toHaveAttribute('aria-current', 'step');
});
