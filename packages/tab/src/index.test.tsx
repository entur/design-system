import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Tabs, TabList, Tab, TabPanel, TabPanels } from '.';

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
