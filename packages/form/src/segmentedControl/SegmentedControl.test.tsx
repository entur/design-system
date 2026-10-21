import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedChoice, SegmentedControl } from '.';
import { describeComponentContract } from '../../../../tests/jest/componentContract';

describe('SegmentedControl', () => {
  it('supports legacy selectedValue prop (deprecated)', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SegmentedControl
        label="Legacy control"
        selectedValue="option1"
        onChange={onChange}
      >
        <SegmentedControl.Item value="option1">Option 1</SegmentedControl.Item>
        <SegmentedControl.Item value="option2">Option 2</SegmentedControl.Item>
      </SegmentedControl>,
    );
    expect(screen.getByRole('radio', { name: 'Option 1' })).toBeChecked();
    const option2 = screen.getByRole('radio', { name: 'Option 2' });
    expect(option2).not.toBeChecked();
    await user.click(option2);
    expect(onChange.mock.calls).toEqual([['option2']]);
  });

  it('supports legacy SegmentedChoice child component', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SegmentedControl
        label="Legacy child"
        value="option1"
        onChange={onChange}
      >
        <SegmentedChoice value="option1">Option 1</SegmentedChoice>
        <SegmentedChoice value="option2">Option 2</SegmentedChoice>
      </SegmentedControl>,
    );
    await user.click(screen.getByRole('radio', { name: 'Option 2' }));
    expect(onChange.mock.calls).toEqual([['option2']]);
  });

  it('names the group and reports selection without changing controlled state until rerender', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const { rerender } = render(
      <SegmentedControl label="Travel mode" value="train" onChange={onChange}>
        <SegmentedControl.Item value="train">Train</SegmentedControl.Item>
        <SegmentedControl.Item value="bus">Bus</SegmentedControl.Item>
      </SegmentedControl>,
    );
    const train = screen.getByRole('radio', { name: 'Train' });
    const bus = screen.getByRole('radio', { name: 'Bus' });
    expect(
      screen.getByRole('radiogroup', { name: 'Travel mode' }),
    ).toContainElement(train);
    expect(train).toBeChecked();
    await user.click(bus);
    expect(onChange.mock.calls).toEqual([['bus']]);
    expect(bus).not.toBeChecked();
    rerender(
      <SegmentedControl label="Travel mode" value="bus" onChange={onChange}>
        <SegmentedControl.Item value="train">Train</SegmentedControl.Item>
        <SegmentedControl.Item value="bus">Bus</SegmentedControl.Item>
      </SegmentedControl>,
    );
    expect(bus).toBeChecked();
    expect(train).not.toBeChecked();
  });

  it('supports selection through a consumer-provided button component', async () => {
    const user = userEvent.setup();
    const CustomButton = React.forwardRef<
      HTMLButtonElement,
      React.ComponentPropsWithoutRef<'button'>
    >((props, ref) => <button type="button" {...props} ref={ref} />);
    render(
      <SegmentedControl label="Travel mode" defaultValue="train">
        <SegmentedControl.Item value="train" as={CustomButton}>
          Train
        </SegmentedControl.Item>
        <SegmentedControl.Item value="bus" as={CustomButton}>
          Bus
        </SegmentedControl.Item>
      </SegmentedControl>,
    );
    await user.click(screen.getByRole('radio', { name: 'Bus' }));
    expect(screen.getByRole('radio', { name: 'Bus' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Train' })).not.toBeChecked();
  });

  it('moves focus with all arrows, Home and End without selecting; Space selects and Escape leaves selection intact', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SegmentedControl
        label="Travel mode"
        defaultValue="train"
        onChange={onChange}
      >
        <SegmentedControl.Item value="train">Train</SegmentedControl.Item>
        <SegmentedControl.Item value="bus">Bus</SegmentedControl.Item>
        <SegmentedControl.Item value="boat">Boat</SegmentedControl.Item>
      </SegmentedControl>,
    );
    const train = screen.getByRole('radio', { name: 'Train' });
    const bus = screen.getByRole('radio', { name: 'Bus' });
    const boat = screen.getByRole('radio', { name: 'Boat' });
    await user.tab();
    expect(train).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(bus).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(boat).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(bus).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(train).toHaveFocus();
    await user.keyboard('{End}');
    expect(boat).toHaveFocus();
    await user.keyboard('{Home}');
    expect(train).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();
    expect(train).toBeChecked();
    await user.keyboard('{ArrowRight} ');
    expect(bus).toBeChecked();
    expect(train).not.toBeChecked();
    expect(onChange.mock.calls).toEqual([['bus']]);
    await user.keyboard('{Escape}');
    expect(bus).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  // Bug: Enter calls handleSelection on keydown and again on the native click.
  it.failing(
    'Enter selects once, including the native button click',
    async () => {
      const user = userEvent.setup();
      const onChange = jest.fn();
      const onItemChange = jest.fn();
      render(
        <SegmentedControl
          label="Travel mode"
          defaultValue="train"
          onChange={onChange}
        >
          <SegmentedControl.Item value="train">Train</SegmentedControl.Item>
          <SegmentedControl.Item value="bus" onChange={onItemChange}>
            Bus
          </SegmentedControl.Item>
        </SegmentedControl>,
      );
      await user.tab();
      await user.keyboard('{ArrowRight}{Enter}');
      expect(screen.getByRole('radio', { name: 'Bus' })).toBeChecked();
      expect(onChange.mock.calls).toEqual([['bus']]);
      expect(onItemChange.mock.calls).toEqual([['bus']]);
    },
  );

  // Bug: getNextWithDataValue includes disabled items in keyboard navigation.
  it.failing('arrow navigation skips disabled items', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SegmentedControl
        label="Travel mode"
        defaultValue="train"
        onChange={onChange}
      >
        <SegmentedControl.Item value="train">Train</SegmentedControl.Item>
        <SegmentedControl.Item value="bus" disabled>
          Bus
        </SegmentedControl.Item>
        <SegmentedControl.Item value="boat">Boat</SegmentedControl.Item>
      </SegmentedControl>,
    );
    await user.click(screen.getByRole('radio', { name: 'Bus' }));
    expect(onChange).not.toHaveBeenCalled();
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Boat' })).toHaveFocus();
  });

  it('disabled item ignores mouse activation', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <SegmentedControl
        label="Travel mode"
        defaultValue="train"
        onChange={onChange}
      >
        <SegmentedControl.Item value="train">Train</SegmentedControl.Item>
        <SegmentedControl.Item value="bus" disabled>
          Bus
        </SegmentedControl.Item>
      </SegmentedControl>,
    );
    await user.click(screen.getByRole('radio', { name: 'Bus' }));
    expect(screen.getByRole('radio', { name: 'Bus' })).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('supports uncontrolled behavior and submits the selected value without submitting on selection', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit(Object.fromEntries(new FormData(e.currentTarget)));
        }}
      >
        <SegmentedControl label="Travel mode" name="mode" defaultValue="train">
          <SegmentedControl.Item value="train">Train</SegmentedControl.Item>
          <SegmentedControl.Item value="bus">Bus</SegmentedControl.Item>
          <SegmentedControl.Item value="boat">Boat</SegmentedControl.Item>
        </SegmentedControl>
        <button type="submit">Submit</button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenLastCalledWith({ mode: 'train' });
    for (const [name, value] of [
      ['Bus', 'bus'],
      ['Boat', 'boat'],
    ]) {
      onSubmit.mockClear();
      await user.click(screen.getByRole('radio', { name }));
      expect(onSubmit).not.toHaveBeenCalled();
      expect(screen.getByRole('radio', { name })).toBeChecked();
      await user.click(screen.getByRole('button', { name: 'Submit' }));
      expect(onSubmit).toHaveBeenCalledWith({ mode: value });
    }
  });

  it.each([null, 'bus'])(
    'has one Tab stop when initial value is %s and calls focus/blur callbacks',
    async defaultValue => {
      const user = userEvent.setup();
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      render(
        <>
          <SegmentedControl
            label="Travel mode"
            defaultValue={defaultValue}
            onFocus={onFocus}
            onBlur={onBlur}
          >
            <SegmentedControl.Item value="train">Train</SegmentedControl.Item>
            <SegmentedControl.Item value="bus">Bus</SegmentedControl.Item>
          </SegmentedControl>
          <button>Continue</button>
        </>,
      );
      const entry = screen.getByRole('radio', {
        name: defaultValue === null ? 'Train' : 'Bus',
      });
      await user.tab();
      expect(entry).toHaveFocus();
      expect(onFocus).toHaveBeenCalledTimes(1);
      await user.tab();
      expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
      expect(onBlur).toHaveBeenCalledTimes(1);
      await user.tab({ shift: true });
      expect(entry).toHaveFocus();
    },
  );

  it('supports keyboard selection when items render as anchors', async () => {
    const user = userEvent.setup();
    render(
      <SegmentedControl label="Travel mode" defaultValue="train">
        <SegmentedControl.Item value="train" as="a" href="#train">
          Train
        </SegmentedControl.Item>
        <SegmentedControl.Item value="bus" as="a" href="#bus">
          Bus
        </SegmentedControl.Item>
      </SegmentedControl>,
    );
    expect(screen.getByRole('radio', { name: 'Bus' })).toHaveAttribute(
      'href',
      '#bus',
    );
    await user.tab();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(screen.getByRole('radio', { name: 'Bus' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Bus' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Train' })).not.toBeChecked();
  });

  it('size="large" sets the large modifier on its items', () => {
    const { rerender } = render(
      <SegmentedControl label="Travel mode" defaultValue="train">
        <SegmentedControl.Item value="train">Train</SegmentedControl.Item>
      </SegmentedControl>,
    );
    const train = screen.getByRole('radio', { name: 'Train' });
    expect(train).not.toHaveClass('eds-segmented-choice--large');
    rerender(
      <SegmentedControl label="Travel mode" defaultValue="train" size="large">
        <SegmentedControl.Item value="train">Train</SegmentedControl.Item>
      </SegmentedControl>,
    );
    expect(train).toHaveClass('eds-segmented-choice--large');
  });
});

describeComponentContract('SegmentedControl', {
  render: props => (
    <SegmentedControl label="Travel mode" defaultValue="train" {...props}>
      <SegmentedControl.Item value="train">Train</SegmentedControl.Item>
    </SegmentedControl>
  ),
  getElement: () => screen.getByRole('radiogroup', { name: 'Travel mode' }),
  baseClassName: 'eds-segmented-control',
  refElement: HTMLDivElement,
});

describeComponentContract('SegmentedControl.Item', {
  render: props => (
    <SegmentedControl label="Travel mode" defaultValue="train">
      <SegmentedControl.Item value="train" {...props}>
        Train
      </SegmentedControl.Item>
    </SegmentedControl>
  ),
  getElement: () => screen.getByRole('radio', { name: 'Train' }),
  baseClassName: 'eds-segmented-choice',
  refElement: HTMLButtonElement,
  as: 'a',
});
