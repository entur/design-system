import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Accordion, AccordionItem } from '.';
import {
  runAllTimers,
  setupUserWithFakeTimers,
  useFakeTimersInSuite,
} from '../../../tests/jest/fakeTimers';
import {
  expectCollapsed,
  expectExpanded,
  getControlledElement,
} from '../../../tests/jest/disclosure';

useFakeTimersInSuite();

test('renders a single accordion item', async () => {
  const user = setupUserWithFakeTimers();
  const { getByRole, getByText } = render(
    <Accordion>
      <AccordionItem title="Trains">Trains go choo choo</AccordionItem>
    </Accordion>,
  );

  // Default unmountOnClose=false: content in DOM but hidden
  const content = getByText('Trains go choo choo');
  expectCollapsed(content);

  const trigger = getByRole('button', { name: 'Trains' });
  const contentId = trigger.getAttribute('aria-controls')!;
  expect(getControlledElement(trigger)).toContainElement(content);
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await user.tab();
  expect(trigger).toHaveFocus();
  await user.keyboard('{Enter}');
  runAllTimers();

  expectExpanded(content);
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(trigger).toHaveAttribute('aria-controls', contentId);

  await user.keyboard(' ');

  expect(trigger).toHaveFocus();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expectCollapsed(content);
});

test('makes collapsed content inert and preserves input state', async () => {
  const user = setupUserWithFakeTimers();
  const { getByRole, getByText } = render(
    <Accordion>
      <AccordionItem title="Trains">
        <button type="button">Buy ticket</button>
        <input aria-label="Passenger" />
      </AccordionItem>
    </Accordion>,
  );

  const content = getByText('Buy ticket');
  expectCollapsed(content);

  await user.click(getByRole('button', { name: 'Trains' }));
  runAllTimers();

  expectExpanded(content);
  const input = getByRole('textbox', { name: 'Passenger' });
  await user.type(input, 'Ada');

  await user.click(getByRole('button', { name: 'Trains' }));

  expectCollapsed(content);
  expect(input).toBeInTheDocument();
  await user.click(getByRole('button', { name: 'Trains' }));
  runAllTimers();
  expect(getByRole('textbox', { name: 'Passenger' })).toBe(input);
  expect(input).toHaveValue('Ada');
});

test('renders a group of accordion items that can be opened and closed', async () => {
  const user = setupUserWithFakeTimers();
  const { getByRole, getByText } = render(
    <Accordion>
      <AccordionItem title="Trains">Trains go choo choo</AccordionItem>
      <AccordionItem title="Boats">Boats float</AccordionItem>
      <AccordionItem title="Buses">Buses go vroom vroom</AccordionItem>
    </Accordion>,
  );

  const trains = getByText('Trains go choo choo');
  const boats = getByText('Boats float');
  const buses = getByText('Buses go vroom vroom');

  // All closed initially
  expectCollapsed(trains);
  expectCollapsed(boats);
  expectCollapsed(buses);

  const triggers = ['Trains', 'Boats', 'Buses'].map(name =>
    getByRole('button', { name }),
  );
  const ids = triggers.map(trigger => trigger.getAttribute('aria-controls'));
  expect(new Set(ids).size).toBe(3);
  [trains, boats, buses].forEach((content, index) => {
    expect(document.getElementById(ids[index]!)).toContainElement(content);
  });
  await user.click(getByRole('button', { name: 'Boats' }));
  runAllTimers();

  expectCollapsed(trains);
  expectExpanded(boats);
  expectCollapsed(buses);

  await user.click(getByRole('button', { name: 'Trains' }));
  runAllTimers();

  expectExpanded(trains);
  expectCollapsed(boats);
  expectCollapsed(buses);

  await user.click(getByRole('button', { name: 'Trains' }));

  expectCollapsed(trains);
  expectCollapsed(boats);
  expectCollapsed(buses);
});

test('works with the defaultOpen option', async () => {
  const user = setupUserWithFakeTimers();
  const onToggle = jest.fn();
  const { getByRole, getByText } = render(
    <Accordion onToggle={onToggle}>
      <AccordionItem title="Trains" defaultOpen>
        Trains go choo choo
      </AccordionItem>
      <AccordionItem title="Boats" id="boats">
        Boats float
      </AccordionItem>
      <AccordionItem title="Buses">Buses go vroom vroom</AccordionItem>
    </Accordion>,
  );

  runAllTimers();

  const trains = getByText('Trains go choo choo');
  const boats = getByText('Boats float');
  const buses = getByText('Buses go vroom vroom');

  expectExpanded(trains);
  expectCollapsed(boats);
  expectCollapsed(buses);

  expect(onToggle).not.toHaveBeenCalled();
  await user.click(getByRole('button', { name: 'Boats' }));
  expect(onToggle.mock.calls).toEqual([['boats']]);
  runAllTimers();

  expectCollapsed(trains);
  expectExpanded(boats);
  expectCollapsed(buses);
});

test('controlled Accordion with openId and onToggle', async () => {
  const user = setupUserWithFakeTimers();
  const spy = jest.fn();
  const { getByRole, getByText, rerender } = render(
    <Accordion openId={null} onToggle={spy}>
      <AccordionItem title="Trains" id="trains">
        Trains go choo choo
      </AccordionItem>
      <AccordionItem title="Boats" id="boats">
        Boats float
      </AccordionItem>
    </Accordion>,
  );

  const trains = getByText('Trains go choo choo');
  const boats = getByText('Boats float');

  // All closed initially
  expectCollapsed(trains);
  expectCollapsed(boats);

  // Click trains — onToggle called with the id
  await user.click(getByRole('button', { name: 'Trains' }));
  expect(spy.mock.calls).toEqual([['trains']]);
  expect(getByRole('button', { name: 'Trains' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );

  // In controlled mode, nothing changes until parent re-renders
  expectCollapsed(trains);

  // Parent updates openId
  rerender(
    <Accordion openId="trains" onToggle={spy}>
      <AccordionItem title="Trains" id="trains">
        Trains go choo choo
      </AccordionItem>
      <AccordionItem title="Boats" id="boats">
        Boats float
      </AccordionItem>
    </Accordion>,
  );
  runAllTimers();

  expectExpanded(trains);
  expectCollapsed(boats);

  // Click boats
  await user.click(getByRole('button', { name: 'Boats' }));
  expect(spy.mock.calls).toEqual([['trains'], ['boats']]);

  rerender(
    <Accordion openId="boats" onToggle={spy}>
      <AccordionItem title="Trains" id="trains">
        Trains go choo choo
      </AccordionItem>
      <AccordionItem title="Boats" id="boats">
        Boats float
      </AccordionItem>
    </Accordion>,
  );
  runAllTimers();

  expectCollapsed(trains);
  expectExpanded(boats);

  // Activate boats again to close
  await user.keyboard(' ');
  expect(spy.mock.calls).toEqual([['trains'], ['boats'], [null]]);
  expect(getByRole('button', { name: 'Boats' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  rerender(
    <Accordion openId={null} onToggle={spy}>
      <AccordionItem title="Trains" id="trains">
        Trains go choo choo
      </AccordionItem>
      <AccordionItem title="Boats" id="boats">
        Boats float
      </AccordionItem>
    </Accordion>,
  );
  expect(getByRole('button', { name: 'Boats' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  expectCollapsed(boats);
});

test('Accordion defaultOpenId sets initial open item', () => {
  const { getByText } = render(
    <Accordion defaultOpenId="boats">
      <AccordionItem title="Trains" id="trains">
        Trains go choo choo
      </AccordionItem>
      <AccordionItem title="Boats" id="boats">
        Boats float
      </AccordionItem>
    </Accordion>,
  );

  runAllTimers();

  const trains = getByText('Trains go choo choo');
  const boats = getByText('Boats float');

  expectCollapsed(trains);
  expectExpanded(boats);
});

test('skips disabled disclosures in the tab order without toggling them', async () => {
  const user = setupUserWithFakeTimers();
  const onToggle = jest.fn();
  const { getByRole } = render(
    <Accordion onToggle={onToggle}>
      <AccordionItem title="Trains" id="trains" disabled>
        Trains go choo choo
      </AccordionItem>
      <AccordionItem title="Boats" id="boats">
        Boats float
      </AccordionItem>
    </Accordion>,
  );
  const trains = getByRole('button', { name: 'Trains' });
  const boats = getByRole('button', { name: 'Boats' });
  expect(trains).toBeDisabled();
  await user.click(trains);
  expect(onToggle).not.toHaveBeenCalled();
  expect(trains).toHaveAttribute('aria-expanded', 'false');
  await user.tab();
  expect(boats).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onToggle.mock.calls).toEqual([['boats']]);
  expect(boats).toHaveAttribute('aria-expanded', 'true');
  expect(trains).toHaveAttribute('aria-expanded', 'false');
});

test('AccordionItem splits consumer props between the panel and its trigger', () => {
  const ref = createRef<HTMLDivElement>();
  const { container } = render(
    <Accordion>
      <AccordionItem
        ref={ref}
        title="Trains"
        className="consumer-class"
        data-consumer="value"
        contentStyle={{ marginTop: '7px' }}
      >
        Trains go choo choo
      </AccordionItem>
    </Accordion>,
  );
  const panel = container.firstElementChild;
  expect(ref.current).toBe(panel);
  expect(panel).toHaveClass('eds-expandable-panel', 'consumer-class');
  const trigger = screen.getByRole('button', { name: 'Trains' });
  expect(trigger).toHaveAttribute('data-consumer', 'value');
  expect(getControlledElement(trigger)).toHaveStyle({ marginTop: '7px' });
});
