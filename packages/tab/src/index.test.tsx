import { StrictMode, Suspense } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '.';

function renderTabs(props: { onChange?: (index: number) => void } = {}) {
  return render(
    <Tabs {...props}>
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
        <TabPanel>Panel 3</TabPanel>
      </TabPanels>
    </Tabs>,
  );
}

test('renders tabs with correct ARIA roles', () => {
  const { getByRole, getAllByRole } = renderTabs();

  expect(getByRole('tablist')).toBeInTheDocument();
  expect(getAllByRole('tab')).toHaveLength(3);
  expect(getByRole('tabpanel')).toBeInTheDocument();
});

test('first tab is selected by default', () => {
  const { getAllByRole, getByText } = renderTabs();

  const tabs = getAllByRole('tab');
  expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
  expect(tabs[2]).toHaveAttribute('aria-selected', 'false');

  expect(getByText('Panel 1')).toBeInTheDocument();
});

test('clicking a tab switches the active panel', () => {
  const onChange = jest.fn();
  const { getAllByRole, getByText, queryByText } = renderTabs({ onChange });

  const tabs = getAllByRole('tab');
  fireEvent.click(tabs[1]);

  expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  expect(tabs[0]).toHaveAttribute('aria-selected', 'false');

  expect(queryByText('Panel 1')).not.toBeInTheDocument();
  expect(getByText('Panel 2')).toBeInTheDocument();

  expect(onChange).toHaveBeenCalledWith(1);
});

test('supports controlled index', () => {
  const { getAllByRole, getByText, rerender } = render(
    <Tabs index={0}>
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
      </TabPanels>
    </Tabs>,
  );

  expect(getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true');
  expect(getByText('Panel 1')).toBeInTheDocument();

  rerender(
    <Tabs index={1}>
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
      </TabPanels>
    </Tabs>,
  );

  expect(getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
  expect(getByText('Panel 2')).toBeInTheDocument();
});

test('supports defaultIndex', () => {
  const { getAllByRole, getByText } = render(
    <Tabs defaultIndex={2}>
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
        <TabPanel>Panel 3</TabPanel>
      </TabPanels>
    </Tabs>,
  );

  expect(getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'true');
  expect(getByText('Panel 3')).toBeInTheDocument();
});

test('disabled tab cannot be clicked', () => {
  const onChange = jest.fn();
  const { getAllByRole } = render(
    <Tabs onChange={onChange}>
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab disabled>Tab 2</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
      </TabPanels>
    </Tabs>,
  );

  const tabs = getAllByRole('tab');
  expect(tabs[1]).toBeDisabled();

  fireEvent.click(tabs[1]);
  expect(onChange).not.toHaveBeenCalled();
  expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
});

test('keyboard navigation skips disabled tabs', () => {
  const { getAllByRole, getByRole } = render(
    <Tabs>
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab disabled>Tab 2</Tab>
        <Tab>Tab 3</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
        <TabPanel>Panel 3</TabPanel>
      </TabPanels>
    </Tabs>,
  );

  const tabs = getAllByRole('tab');
  tabs[0].focus();

  fireEvent.keyDown(getByRole('tablist'), { key: 'ArrowRight' });
  expect(document.activeElement).toBe(tabs[2]);
});

test('tab and panel have matching aria-controls/aria-labelledby', () => {
  const { getAllByRole, getByRole } = renderTabs();

  const tabs = getAllByRole('tab');
  const panel = getByRole('tabpanel');

  const tabId = tabs[0].id;
  const panelId = tabs[0].getAttribute('aria-controls');

  expect(panel.id).toBe(panelId);
  expect(panel.getAttribute('aria-labelledby')).toBe(tabId);
});

test('only the selected tab points aria-controls at a rendered panel', () => {
  const { getAllByRole } = renderTabs();

  const tabs = getAllByRole('tab');
  const selectedPanelId = tabs[0].getAttribute('aria-controls');

  expect(selectedPanelId).toBeTruthy();
  expect(
    document.getElementById(selectedPanelId as string),
  ).toBeInTheDocument();
  // Unselected panels are unmounted, so pointing at their id would be a dangling reference
  expect(tabs[1]).not.toHaveAttribute('aria-controls');
  expect(tabs[2]).not.toHaveAttribute('aria-controls');
});

test('ArrowRight moves focus to next tab', () => {
  const { getAllByRole, getByRole } = renderTabs();

  const tabs = getAllByRole('tab');
  tabs[0].focus();

  fireEvent.keyDown(getByRole('tablist'), { key: 'ArrowRight' });
  expect(document.activeElement).toBe(tabs[1]);
});

test('ArrowLeft moves focus to previous tab', () => {
  const { getAllByRole, getByRole } = renderTabs();

  const tabs = getAllByRole('tab');
  fireEvent.click(tabs[1]);
  tabs[1].focus();

  fireEvent.keyDown(getByRole('tablist'), { key: 'ArrowLeft' });
  expect(document.activeElement).toBe(tabs[0]);
});

test('ArrowRight wraps from last to first tab', () => {
  const { getAllByRole, getByRole } = renderTabs();

  const tabs = getAllByRole('tab');
  fireEvent.click(tabs[2]);
  tabs[2].focus();

  fireEvent.keyDown(getByRole('tablist'), { key: 'ArrowRight' });
  expect(document.activeElement).toBe(tabs[0]);
});

test('Home key moves focus to first tab', () => {
  const { getAllByRole, getByRole } = renderTabs();

  const tabs = getAllByRole('tab');
  fireEvent.click(tabs[2]);
  tabs[2].focus();

  fireEvent.keyDown(getByRole('tablist'), { key: 'Home' });
  expect(document.activeElement).toBe(tabs[0]);
});

test('End key moves focus to last tab', () => {
  const { getAllByRole, getByRole } = renderTabs();

  const tabs = getAllByRole('tab');
  tabs[0].focus();

  fireEvent.keyDown(getByRole('tablist'), { key: 'End' });
  expect(document.activeElement).toBe(tabs[2]);
});

test('Tabs supports as prop', () => {
  const { container } = render(
    <Tabs as="section">
      <TabList>
        <Tab>Tab 1</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Panel 1</TabPanel>
      </TabPanels>
    </Tabs>,
  );

  expect(container.querySelector('section')).toBeInTheDocument();
});

test('TabList supports as prop', () => {
  const { container } = render(
    <Tabs>
      <TabList as="nav">
        <Tab>Tab 1</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Panel 1</TabPanel>
      </TabPanels>
    </Tabs>,
  );

  expect(container.querySelector('nav[role="tablist"]')).toBeInTheDocument();
});

test('TabPanel supports as prop', () => {
  const { container } = render(
    <Tabs>
      <TabList>
        <Tab>Tab 1</Tab>
      </TabList>
      <TabPanels>
        <TabPanel as="section">Panel 1</TabPanel>
      </TabPanels>
    </Tabs>,
  );

  expect(
    container.querySelector('section[role="tabpanel"]'),
  ).toBeInTheDocument();
});

test('TabPanels supports as prop', () => {
  const { container } = render(
    <Tabs>
      <TabList>
        <Tab>Tab 1</Tab>
      </TabList>
      <TabPanels as="section">
        <TabPanel>Panel 1</TabPanel>
      </TabPanels>
    </Tabs>,
  );

  expect(container.querySelector('section.eds-tab-panels')).toBeInTheDocument();
});

test('active tabpanel has tabIndex 0', () => {
  const { getByRole } = renderTabs();
  expect(getByRole('tabpanel')).toHaveAttribute('tabindex', '0');
});

test('keepMounted keeps all panels in DOM', () => {
  const { getAllByRole, getByText } = render(
    <Tabs>
      <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
      </TabList>
      <TabPanels keepMounted>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
      </TabPanels>
    </Tabs>,
  );

  expect(getByText('Panel 1')).toBeInTheDocument();
  expect(getByText('Panel 2')).toBeInTheDocument();

  const panels = getAllByRole('tabpanel', { hidden: true });
  expect(panels).toHaveLength(2);
  expect(panels[1]).toHaveAttribute('hidden');
  expect(panels[0]).not.toHaveAttribute('hidden');
});

describe('panels nested in markup', () => {
  test('tabs and panels inside fragments get their own index', () => {
    const { getAllByRole, getByText, queryByText } = render(
      <Tabs>
        <TabList>
          <>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </>
        </TabList>
        <TabPanels>
          <>
            <TabPanel>Panel 1</TabPanel>
            <TabPanel>Panel 2</TabPanel>
            <TabPanel>Panel 3</TabPanel>
          </>
        </TabPanels>
      </Tabs>,
    );

    expect(getByText('Panel 1')).toBeInTheDocument();
    expect(queryByText('Panel 2')).not.toBeInTheDocument();
    expect(queryByText('Panel 3')).not.toBeInTheDocument();

    fireEvent.click(getAllByRole('tab')[2]);

    expect(getByText('Panel 3')).toBeInTheDocument();
    expect(queryByText('Panel 1')).not.toBeInTheDocument();
  });

  test('tabs and panels inside wrapper elements get their own index', () => {
    const { getAllByRole, getByText, queryByText } = render(
      <Tabs>
        <TabList>
          <div>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
            <Tab>Tab 3</Tab>
          </div>
        </TabList>
        <TabPanels>
          <div>
            <TabPanel>Panel 1</TabPanel>
            <TabPanel>Panel 2</TabPanel>
            <TabPanel>Panel 3</TabPanel>
          </div>
        </TabPanels>
      </Tabs>,
    );

    expect(getByText('Panel 1')).toBeInTheDocument();
    expect(queryByText('Panel 2')).not.toBeInTheDocument();

    fireEvent.click(getAllByRole('tab')[1]);

    expect(getByText('Panel 2')).toBeInTheDocument();
    expect(queryByText('Panel 1')).not.toBeInTheDocument();
  });

  test('panels nested several levels deep get their own index', () => {
    const { getAllByRole, getByText, queryByText } = render(
      <Tabs>
        <TabList>
          <div>
            <>
              <Tab>Tab 1</Tab>
              <span>
                <Tab>Tab 2</Tab>
              </span>
            </>
          </div>
        </TabList>
        <TabPanels>
          <div>
            <>
              <TabPanel>Panel 1</TabPanel>
              <div>
                <TabPanel>Panel 2</TabPanel>
              </div>
            </>
          </div>
        </TabPanels>
      </Tabs>,
    );

    const tabs = getAllByRole('tab');
    expect(getByText('Panel 1')).toBeInTheDocument();
    expect(queryByText('Panel 2')).not.toBeInTheDocument();

    fireEvent.click(tabs[1]);

    expect(getByText('Panel 2')).toBeInTheDocument();
    expect(queryByText('Panel 1')).not.toBeInTheDocument();
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  test('tabs and panels inside a Suspense boundary get their own index', () => {
    const { getAllByRole, getByText, queryByText } = render(
      <Tabs>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
        </TabList>
        <TabPanels>
          <Suspense fallback={<span>Loading</span>}>
            <TabPanel>Panel 1</TabPanel>
            <TabPanel>Panel 2</TabPanel>
          </Suspense>
        </TabPanels>
      </Tabs>,
    );

    expect(getByText('Panel 1')).toBeInTheDocument();
    expect(queryByText('Panel 2')).not.toBeInTheDocument();

    fireEvent.click(getAllByRole('tab')[1]);

    expect(getByText('Panel 2')).toBeInTheDocument();
    expect(queryByText('Panel 1')).not.toBeInTheDocument();
  });

  test('content that is not a tab or a panel does not consume an index', () => {
    const showFirstPanel = false;
    const { getAllByRole, getByText } = render(
      <Tabs>
        <TabList>
          <span>Not a tab</span>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
        </TabList>
        <TabPanels>
          <hr />
          {showFirstPanel && <TabPanel>Hidden panel</TabPanel>}
          <TabPanel>Panel 1</TabPanel>
          <TabPanel>Panel 2</TabPanel>
        </TabPanels>
      </Tabs>,
    );

    expect(getByText('Panel 1')).toBeInTheDocument();

    fireEvent.click(getAllByRole('tab')[1]);
    expect(getByText('Panel 2')).toBeInTheDocument();
  });
});

describe('explicit index prop', () => {
  // Stands in for a consumer component that renders one panel, which TabPanels
  // cannot look inside — the only way in is the index prop
  const OwnPanel = ({ index, label }: { index: number; label: string }) => (
    <TabPanel index={index}>{label}</TabPanel>
  );

  test('a panel inside a component gets the index it is given', () => {
    const { getAllByRole, getByText, queryByText } = render(
      <Tabs>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
          <Tab>Tab 3</Tab>
        </TabList>
        <TabPanels>
          <div>
            <OwnPanel index={0} label="Panel 1" />
            <OwnPanel index={1} label="Panel 2" />
            <OwnPanel index={2} label="Panel 3" />
          </div>
        </TabPanels>
      </Tabs>,
    );

    expect(getByText('Panel 1')).toBeInTheDocument();

    fireEvent.click(getAllByRole('tab')[2]);

    expect(getByText('Panel 3')).toBeInTheDocument();
    expect(queryByText('Panel 1')).not.toBeInTheDocument();
  });

  test('the index prop wins over the index TabPanels handed out', () => {
    const { getAllByRole, getByText, queryByText } = render(
      <Tabs>
        <TabList>
          <Tab index={1}>Tab 1</Tab>
          <Tab index={0}>Tab 2</Tab>
        </TabList>
        <TabPanels>
          <TabPanel index={1}>Panel 1</TabPanel>
          <TabPanel index={0}>Panel 2</TabPanel>
        </TabPanels>
      </Tabs>,
    );

    // Index 0 is selected, which is the second tab and the second panel
    expect(getByText('Panel 2')).toBeInTheDocument();
    expect(queryByText('Panel 1')).not.toBeInTheDocument();
    expect(getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(getAllByRole('tab')[0]);
    expect(getByText('Panel 1')).toBeInTheDocument();
  });

  test('aria-controls and aria-labelledby follow the given index', () => {
    const { getAllByRole } = render(
      <Tabs>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
        </TabList>
        <TabPanels>
          <div>
            <OwnPanel index={0} label="Panel 1" />
            <OwnPanel index={1} label="Panel 2" />
          </div>
        </TabPanels>
      </Tabs>,
    );

    const tab = getAllByRole('tab')[1];
    fireEvent.click(tab);

    const panel = getAllByRole('tabpanel')[0];
    expect(panel.id).toBe(tab.getAttribute('aria-controls'));
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  });
});

describe('development warnings', () => {
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

  test('warns when a TabPanel is rendered without TabPanels', () => {
    const { getByText } = render(
      <Tabs>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
        </TabList>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
      </Tabs>,
    );

    // Both panels fall back to index 0 and render at the same time
    expect(getByText('Panel 1')).toBeInTheDocument();
    expect(getByText('Panel 2')).toBeInTheDocument();

    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('<TabPanel> was rendered outside of <TabPanels>'),
    );
  });

  test('warns when a Tab is rendered without TabList', () => {
    render(
      <Tabs>
        <Tab>Tab 1</Tab>
        <TabPanels>
          <TabPanel>Panel 1</TabPanel>
        </TabPanels>
      </Tabs>,
    );

    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('<Tab> was rendered outside of <TabList>'),
    );
  });

  test('warns when the selected index has no panel but later ones do', () => {
    // Only a warning: a panel that is still loading looks the same from here
    const Header = () => <h2>Heading</h2>;

    render(
      <Tabs>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
        </TabList>
        <TabPanels>
          <div>
            <Header />
            <TabPanel>Panel 1</TabPanel>
            <TabPanel>Panel 2</TabPanel>
          </div>
        </TabPanels>
      </Tabs>,
    );

    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('No <TabPanel> got index 0'),
    );
    // The last panel ended up at index 2, which no tab can reach
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('No <Tab> got index 2'),
    );
  });

  test('warns about a panel no tab can reach', () => {
    const showSecondTab = false;

    render(
      <Tabs>
        <TabList>
          <Tab>Tab 1</Tab>
          {showSecondTab && <Tab>Tab 2</Tab>}
        </TabList>
        <TabPanels>
          <TabPanel>Panel 1</TabPanel>
          <TabPanel>Panel 2</TabPanel>
        </TabPanels>
      </Tabs>,
    );

    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('No <Tab> got index 1'),
    );
  });

  test('a tab with no panel of its own does not warn', () => {
    render(
      <Tabs>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>Panel 1</TabPanel>
        </TabPanels>
      </Tabs>,
    );

    expect(consoleError).not.toHaveBeenCalled();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  test('warns when several panels resolve to the same index', () => {
    const TwoPanels = () => (
      <>
        <TabPanel>Panel 1</TabPanel>
        <TabPanel>Panel 2</TabPanel>
      </>
    );

    render(
      <Tabs>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
        </TabList>
        <TabPanels>
          <TwoPanels />
        </TabPanels>
      </Tabs>,
    );

    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining(
        'Several <TabPanel> components got the same index (0)',
      ),
    );
  });

  test('does not warn for supported markup', () => {
    render(
      <Tabs>
        <TabList>
          <>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </>
        </TabList>
        <TabPanels>
          <div>
            <TabPanel>Panel 1</TabPanel>
            <TabPanel>Panel 2</TabPanel>
          </div>
        </TabPanels>
      </Tabs>,
    );

    expect(consoleError).not.toHaveBeenCalled();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  test('an index prop on each panel silences the shared-index error', () => {
    const TwoPanels = () => (
      <>
        <TabPanel index={0}>Panel 1</TabPanel>
        <TabPanel index={1}>Panel 2</TabPanel>
      </>
    );

    render(
      <Tabs>
        <TabList>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
        </TabList>
        <TabPanels>
          <TwoPanels />
        </TabPanels>
      </Tabs>,
    );

    expect(consoleError).not.toHaveBeenCalled();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  test('a panel with an index prop outside TabPanels does not warn', () => {
    render(
      <Tabs>
        <TabList>
          <Tab index={0}>Tab 1</Tab>
        </TabList>
        <TabPanel index={0}>Panel 1</TabPanel>
      </Tabs>,
    );

    expect(consoleError).not.toHaveBeenCalled();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  test('does not warn in StrictMode, where effects run twice', () => {
    render(
      <StrictMode>
        <Tabs>
          <TabList>
            <Tab>Tab 1</Tab>
            <Tab>Tab 2</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Panel 1</TabPanel>
            <TabPanel>Panel 2</TabPanel>
          </TabPanels>
        </Tabs>
      </StrictMode>,
    );

    expect(consoleError).not.toHaveBeenCalled();
    expect(consoleWarn).not.toHaveBeenCalled();
  });
});

test('TabList accepts aria-label', () => {
  const { getByRole } = render(
    <Tabs>
      <TabList aria-label="Navigation tabs">
        <Tab>Tab 1</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Panel 1</TabPanel>
      </TabPanels>
    </Tabs>,
  );

  expect(getByRole('tablist')).toHaveAttribute('aria-label', 'Navigation tabs');
});
