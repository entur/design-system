import { ReactNode, StrictMode, Suspense } from 'react';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '.';
import type { TabsProps } from './Tabs';
import { describeComponentContract } from '../../../tests/jest/componentContract';

function Example({
  keepMounted = false,
  disabledIndex,
  ...props
}: Omit<TabsProps, 'children'> & {
  keepMounted?: boolean;
  disabledIndex?: number;
}) {
  return (
    <Tabs {...props}>
      <TabList aria-label="Journey">
        {['Route', 'Tickets', 'Details'].map((label, index) => (
          <Tab key={label} disabled={index === disabledIndex}>
            {label}
          </Tab>
        ))}
      </TabList>
      <TabPanels keepMounted={keepMounted}>
        <TabPanel>Plan your route</TabPanel>
        <TabPanel>Choose your tickets</TabPanel>
        <TabPanel>Journey details</TabPanel>
      </TabPanels>
    </Tabs>
  );
}

function expectSelection(name: string, content: string) {
  const selected = screen.getByRole('tab', { name, selected: true });
  const panel = screen.getByRole('tabpanel', { name });
  expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
  expect(panel).toBeVisible();
  expect(panel).toHaveTextContent(content);
  expect(panel).toHaveAttribute('aria-labelledby', selected.id);
  expect(selected).toHaveAttribute('aria-controls', panel.id);
  expect(panel).toHaveAttribute('tabindex', '0');
  expect(selected).toHaveAttribute('tabindex', '0');
  for (const tab of screen.queryAllByRole('tab', { selected: false })) {
    expect(tab).toHaveAttribute('tabindex', '-1');
    expect(tab).not.toHaveAttribute('aria-controls');
  }
  expect(screen.getAllByRole('tab', { selected: true })).toHaveLength(1);
}

test('mouse selection updates the panel, focus and ARIA relationships', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(<Example onChange={onChange} />);

  expect(screen.getByRole('tablist', { name: 'Journey' })).toBeInTheDocument();
  expectSelection('Route', 'Plan your route');
  expect(onChange).not.toHaveBeenCalled();

  await user.click(screen.getByRole('tab', { name: 'Tickets' }));

  expectSelection('Tickets', 'Choose your tickets');
  expect(screen.getByRole('tab', { name: 'Tickets' })).toHaveFocus();
  expect(screen.queryByText('Plan your route')).not.toBeInTheDocument();
  expect(onChange.mock.calls).toEqual([[1]]);
});

test('keyboard navigation selects automatically, wraps and exits through the panel', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(
    <>
      <Example onChange={onChange} />
      <button>Continue</button>
    </>,
  );

  await user.tab();
  expect(screen.getByRole('tab', { name: 'Route' })).toHaveFocus();

  const steps = [
    ['{ArrowRight}', 'Tickets', 'Choose your tickets'],
    ['{ArrowRight}', 'Details', 'Journey details'],
    ['{ArrowRight}', 'Route', 'Plan your route'],
    ['{ArrowLeft}', 'Details', 'Journey details'],
    ['{ArrowLeft}', 'Tickets', 'Choose your tickets'],
    ['{Home}', 'Route', 'Plan your route'],
    ['{End}', 'Details', 'Journey details'],
  ];
  for (const [key, name, content] of steps) {
    await user.keyboard(key);
    expect(screen.getByRole('tab', { name })).toHaveFocus();
    expectSelection(name, content);
  }
  expect(onChange.mock.calls).toEqual([[1], [2], [0], [2], [1], [0], [2]]);

  await user.tab();
  expect(screen.getByRole('tabpanel', { name: 'Details' })).toHaveFocus();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
  await user.tab({ shift: true });
  await user.tab({ shift: true });
  expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
});

test('defaultIndex initializes uncontrolled selection without resetting it on rerender', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<Example defaultIndex={2} />);
  expectSelection('Details', 'Journey details');
  await user.tab();
  expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();

  await user.keyboard('{Home}');
  expectSelection('Route', 'Plan your route');
  rerender(<Example defaultIndex={1} />);
  expectSelection('Route', 'Plan your route');
});

test('controlled selection requests changes but waits for the parent index', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  const { rerender } = render(
    <Example index={0} defaultIndex={2} onChange={onChange} />,
  );
  expectSelection('Route', 'Plan your route');

  await user.click(screen.getByRole('tab', { name: 'Tickets' }));
  expect(screen.getByRole('tab', { name: 'Tickets' })).toHaveFocus();
  expectSelection('Route', 'Plan your route');
  expect(onChange.mock.calls).toEqual([[1]]);

  rerender(<Example index={1} onChange={onChange} />);
  expectSelection('Tickets', 'Choose your tickets');
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
  expectSelection('Tickets', 'Choose your tickets');
  expect(onChange.mock.calls).toEqual([[1], [2]]);

  rerender(<Example index={2} onChange={onChange} />);
  expectSelection('Details', 'Journey details');
  expect(onChange.mock.calls).toEqual([[1], [2]]);
});

test('disabled tabs reject mouse selection and are skipped by arrow navigation', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(<Example disabledIndex={1} onChange={onChange} />);
  const disabled = screen.getByRole('tab', { name: 'Tickets' });
  expect(disabled).toBeDisabled();
  expect(disabled).toHaveAttribute('aria-disabled', 'true');

  await user.click(disabled);
  expectSelection('Route', 'Plan your route');
  expect(onChange).not.toHaveBeenCalled();
  await user.tab();
  await user.keyboard('{ArrowRight}');
  expectSelection('Details', 'Journey details');
  expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
  await user.keyboard('{ArrowLeft}');
  expectSelection('Route', 'Plan your route');
  expect(screen.getByRole('tab', { name: 'Route' })).toHaveFocus();
  expect(onChange.mock.calls).toEqual([[2], [0]]);
});

test('Home and End skip disabled endpoints', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<Example defaultIndex={1} disabledIndex={0} />);
  await user.tab();
  await user.keyboard('{End}');
  expectSelection('Details', 'Journey details');
  expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
  await user.keyboard('{Home}');
  expectSelection('Tickets', 'Choose your tickets');
  expect(screen.getByRole('tab', { name: 'Tickets' })).toHaveFocus();

  rerender(<Example disabledIndex={2} />);
  await user.keyboard('{Home}');
  expectSelection('Route', 'Plan your route');
  expect(screen.getByRole('tab', { name: 'Route' })).toHaveFocus();
  await user.keyboard('{End}');
  expectSelection('Tickets', 'Choose your tickets');
  expect(screen.getByRole('tab', { name: 'Tickets' })).toHaveFocus();
});

test.each([false, true])(
  'keepMounted=%s controls whether panel input survives switching',
  async keepMounted => {
    const user = userEvent.setup();
    render(
      <Tabs>
        <TabList aria-label="Booking">
          <Tab>Passenger</Tab>
          <Tab>Summary</Tab>
        </TabList>
        <TabPanels keepMounted={keepMounted}>
          <TabPanel>
            <label>
              Name
              <input />
            </label>
          </TabPanel>
          <TabPanel>Booking summary</TabPanel>
        </TabPanels>
      </Tabs>,
    );
    const passengerPanel = screen.getByRole('tabpanel', { name: 'Passenger' });
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');
    await user.click(screen.getByRole('tab', { name: 'Summary' }));
    expectSelection('Summary', 'Booking summary');
    expect(
      screen.queryByRole('textbox', { name: 'Name' }),
    ).not.toBeInTheDocument();
    if (keepMounted) {
      expect(passengerPanel).toBeInTheDocument();
      expect(passengerPanel).not.toBeVisible();
      expect(passengerPanel).toHaveAttribute('hidden');
      expect(passengerPanel).toHaveAttribute('tabindex', '-1');
    } else {
      expect(passengerPanel).not.toBeInTheDocument();
    }
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tabpanel', { name: 'Passenger' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue(
      keepMounted ? 'Ada' : '',
    );
  },
);

test('nested markup and non-item children preserve automatic indexing', async () => {
  const user = userEvent.setup();
  render(
    <Tabs as="section">
      <h2 id="journey-heading">Journey</h2>
      <TabList as="nav" aria-labelledby="journey-heading">
        <span>Choose a tab</span>
        <>
          <Tab>Route</Tab>
          <div>
            <Tab>Tickets</Tab>
          </div>
        </>
      </TabList>
      <TabPanels as="section">
        <hr />
        {false}
        <Suspense fallback="Loading">
          <>
            <TabPanel as="section">Plan your route</TabPanel>
            <div>
              <TabPanel as="section">Choose your tickets</TabPanel>
            </div>
          </>
        </Suspense>
      </TabPanels>
    </Tabs>,
  );
  expect(screen.getByRole('tablist', { name: 'Journey' })).toBeInTheDocument();
  expectSelection('Route', 'Plan your route');
  await user.click(screen.getByRole('tab', { name: 'Tickets' }));
  expectSelection('Tickets', 'Choose your tickets');
  await user.keyboard('{ArrowLeft}');
  expectSelection('Route', 'Plan your route');
});

test('explicit indices inside consumer components override their DOM order', async () => {
  const user = userEvent.setup();
  const OwnTabs = () => (
    <>
      <Tab index={1}>Tickets</Tab>
      <Tab index={0}>Route</Tab>
    </>
  );
  const OwnPanels = () => (
    <>
      <TabPanel index={0}>Plan your route</TabPanel>
      <TabPanel index={1}>Choose your tickets</TabPanel>
    </>
  );
  render(
    <Tabs>
      <TabList>
        <OwnTabs />
      </TabList>
      <TabPanels>
        <OwnPanels />
      </TabPanels>
    </Tabs>,
  );
  expectSelection('Route', 'Plan your route');
  await user.click(screen.getByRole('tab', { name: 'Tickets' }));
  expectSelection('Tickets', 'Choose your tickets');
  await user.keyboard('{ArrowRight}');
  expectSelection('Route', 'Plan your route');
  expect(screen.getByRole('tab', { name: 'Route' })).toHaveFocus();
});

test('separate tab groups keep unique panel relationships and independent selection', async () => {
  const user = userEvent.setup();
  render(
    <>
      <section aria-label="Outbound">
        <Example />
      </section>
      <section aria-label="Return">
        <Example />
      </section>
    </>,
  );
  const outbound = within(screen.getByRole('region', { name: 'Outbound' }));
  const inbound = within(screen.getByRole('region', { name: 'Return' }));
  expect(outbound.getByRole('tabpanel').id).not.toBe(
    inbound.getByRole('tabpanel').id,
  );
  await user.click(outbound.getByRole('tab', { name: 'Tickets' }));
  const outboundPanel = outbound.getByRole('tabpanel', { name: 'Tickets' });
  const inboundPanel = inbound.getByRole('tabpanel', { name: 'Route' });
  expect(outboundPanel.id).not.toBe(inboundPanel.id);
  for (const group of [outbound, inbound]) {
    const tab = group.getByRole('tab', { selected: true });
    const panel = group.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  }
});

describe('development warnings', () => {
  const Wrapper = ({ children }: { children: ReactNode }) => <>{children}</>;
  let consoleError: jest.SpyInstance;
  let consoleWarn: jest.SpyInstance;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    consoleError.mockRestore();
    consoleWarn.mockRestore();
  });

  test.each(['tab', 'panel'])(
    'warns for a %s outside its indexing parent',
    kind => {
      render(
        <Tabs>
          {kind === 'tab' ? (
            <Tab>Route</Tab>
          ) : (
            <TabPanel>Plan your route</TabPanel>
          )}
        </Tabs>,
      );
      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining(
          kind === 'tab'
            ? '<Tab> was rendered outside of <TabList>'
            : '<TabPanel> was rendered outside of <TabPanels>',
        ),
      );
    },
  );

  test('warns for a missing selected panel and an unreachable trailing panel', () => {
    const Header = () => <h2>Heading</h2>;
    render(
      <Tabs>
        <TabList>
          <Tab>Route</Tab>
          <Tab>Tickets</Tab>
        </TabList>
        <TabPanels>
          <Header />
          <TabPanel>Plan your route</TabPanel>
          <TabPanel>Choose your tickets</TabPanel>
        </TabPanels>
      </Tabs>,
    );
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('No <TabPanel> got index 0'),
    );
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('No <Tab> got index 2'),
    );
  });

  test('warns when a conditional tab disappears without its panel', () => {
    const Conditional = ({ show }: { show: boolean }) => (
      <Tabs>
        <TabList>
          <Tab>Route</Tab>
          {show && <Tab>Tickets</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>Plan your route</TabPanel>
          <TabPanel>Choose your tickets</TabPanel>
        </TabPanels>
      </Tabs>
    );
    const { rerender } = render(<Conditional show />);
    expect(consoleError).not.toHaveBeenCalled();
    rerender(<Conditional show={false} />);
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('No <Tab> got index 1'),
    );
  });

  test('a trailing tab without a panel can be selected without a warning', async () => {
    const user = userEvent.setup();
    render(
      <Tabs>
        <TabList>
          <Tab>Route</Tab>
          <Tab>Tickets</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Plan your route</TabPanel>
        </TabPanels>
      </Tabs>,
    );
    await user.click(screen.getByRole('tab', { name: 'Tickets' }));
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  test.each([false, true])(
    'explicit indices=%s determine whether consumer wrappers share an index',
    explicit => {
      render(
        <Tabs>
          <TabList>
            <Wrapper>
              <Tab index={explicit ? 0 : undefined}>Route</Tab>
              <Tab index={explicit ? 1 : undefined}>Tickets</Tab>
            </Wrapper>
          </TabList>
          <TabPanels>
            <Wrapper>
              <TabPanel index={explicit ? 0 : undefined}>
                Plan your route
              </TabPanel>
              <TabPanel index={explicit ? 1 : undefined}>
                Choose your tickets
              </TabPanel>
            </Wrapper>
          </TabPanels>
        </Tabs>,
      );
      if (explicit) {
        expect(consoleError).not.toHaveBeenCalled();
        expect(consoleWarn).not.toHaveBeenCalled();
      } else {
        for (const component of ['Tab', 'TabPanel']) {
          expect(consoleError).toHaveBeenCalledWith(
            expect.stringContaining(
              `Several <${component}> components got the same index (0)`,
            ),
          );
        }
      }
    },
  );

  test('warns about duplicate panels after a Suspense boundary resolves', async () => {
    let resolvePanels: () => void = () => undefined;
    let hasLoaded = false;
    const loading = new Promise<void>(resolve => {
      resolvePanels = () => {
        hasLoaded = true;
        resolve();
      };
    });
    const LoadsLate = () => {
      if (!hasLoaded) throw loading;
      return <span>Loaded</span>;
    };
    render(
      <Tabs>
        <TabList>
          <Tab>Route</Tab>
          <Tab>Tickets</Tab>
        </TabList>
        <TabPanels>
          <Wrapper>
            <Suspense fallback="Loading">
              <TabPanel>
                <LoadsLate />
              </TabPanel>
              <TabPanel>
                <LoadsLate />
              </TabPanel>
            </Suspense>
          </Wrapper>
        </TabPanels>
      </Tabs>,
    );
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();
    await act(async () => {
      resolvePanels();
      await loading;
    });
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining(
        'Several <TabPanel> components got the same index (0)',
      ),
    );
  });

  test('explicit indices outside indexing parents do not warn', () => {
    render(
      <Tabs>
        <Tab index={0}>Route</Tab>
        <TabPanel index={0}>Plan your route</TabPanel>
      </Tabs>,
    );
    expectSelection('Route', 'Plan your route');
    expect(consoleError).not.toHaveBeenCalled();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  test('supported markup does not warn in StrictMode after selection', async () => {
    const user = userEvent.setup();
    render(
      <StrictMode>
        <Example />
      </StrictMode>,
    );
    await user.click(screen.getByRole('tab', { name: 'Tickets' }));
    expectSelection('Tickets', 'Choose your tickets');
    expect(consoleError).not.toHaveBeenCalled();
    expect(consoleWarn).not.toHaveBeenCalled();
  });
});

function ContractExample({
  tabs,
  tabList,
  tab,
  tabPanels,
  tabPanel,
}: {
  tabs?: Record<string, unknown>;
  tabList?: Record<string, unknown>;
  tab?: Record<string, unknown>;
  tabPanels?: Record<string, unknown>;
  tabPanel?: Record<string, unknown>;
}) {
  return (
    <Tabs {...tabs}>
      <TabList aria-label="Journey" {...tabList}>
        <Tab {...tab}>Route</Tab>
      </TabList>
      <TabPanels {...tabPanels}>
        <TabPanel {...tabPanel}>Plan your route</TabPanel>
      </TabPanels>
    </Tabs>
  );
}

describeComponentContract('Tabs', {
  render: props => <ContractExample tabs={props} />,
  getElement: ({ container }) => container.firstElementChild as HTMLElement,
  baseClassName: 'eds-tabs',
  as: 'section',
});

describeComponentContract('TabList', {
  render: props => <ContractExample tabList={props} />,
  getElement: () => screen.getByRole('tablist', { name: 'Journey' }),
  baseClassName: 'eds-tab-list',
  as: 'nav',
});

describeComponentContract('Tab', {
  render: props => <ContractExample tab={props} />,
  getElement: () => screen.getByRole('tab', { name: 'Route' }),
  baseClassName: 'eds-tab',
  as: 'a',
});

describeComponentContract('TabPanels', {
  render: props => <ContractExample tabPanels={props} />,
  getElement: () =>
    screen.getByRole('tabpanel', { name: 'Route' }).parentElement!,
  baseClassName: 'eds-tab-panels',
  as: 'section',
});

describeComponentContract('TabPanel', {
  render: props => <ContractExample tabPanel={props} />,
  getElement: () => screen.getByRole('tabpanel', { name: 'Route' }),
  baseClassName: 'eds-tab-panel',
  as: 'section',
});

test('width="fluid" and removeActiveLine set their modifier classes', () => {
  const { rerender } = render(<ContractExample />);
  const tabList = screen.getByRole('tablist', { name: 'Journey' });
  const tab = screen.getByRole('tab', { name: 'Route' });
  expect(tabList).not.toHaveClass('eds-tab-list--width-fluid');
  expect(tab).not.toHaveClass('eds-tab--remove-active-line');
  rerender(
    <ContractExample
      tabList={{ width: 'fluid' }}
      tab={{ removeActiveLine: true }}
    />,
  );
  expect(tabList).toHaveClass('eds-tab-list--width-fluid');
  expect(tab).toHaveClass('eds-tab--remove-active-line');
});
