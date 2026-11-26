import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDate } from '@internationalized/date';
import { DatePicker } from '@entur/datepicker';
import {
  Dropdown,
  NormalizedDropdownItemType,
  SearchableDropdown,
} from '@entur/dropdown';
import { OverflowMenu, OverflowMenuItem } from '@entur/menu';
import { Drawer, Modal } from '@entur/modal';
import { SegmentedControl } from '@entur/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@entur/tooltip';

import '@entur/tokens/styles';
import '@entur/button/styles';
import '@entur/datepicker/styles';
import '@entur/dropdown/styles';
import '@entur/form/styles';
import '@entur/icons/styles';
import '@entur/menu/styles';
import '@entur/modal/styles';
import '@entur/tooltip/styles';
import '@entur/typography/styles';

const cities = ['Oslo', 'Bergen', 'Trondheim'];

function Fixture() {
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [city, setCity] = useState<NormalizedDropdownItemType | null>({
    label: 'Oslo',
    value: 'Oslo',
  });
  const [date, setDate] = useState<CalendarDate | null>(
    new CalendarDate(2026, 11, 26),
  );

  return (
    <main>
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>
      <Modal
        title="Journey"
        size="medium"
        open={open}
        onDismiss={() => setOpen(false)}
        closeLabel="Close modal"
      >
        <Dropdown
          label="City"
          items={cities}
          selectedItem={null}
          onChange={() => undefined}
        />
        <Dropdown
          label="Home city"
          items={cities}
          selectedItem={city}
          onChange={setCity}
          clearable
        />
        <button type="button" onClick={() => setDrawerOpen(true)}>
          Open drawer
        </button>
        <Drawer
          title="Details"
          open={drawerOpen}
          onDismiss={() => setDrawerOpen(false)}
          closeLabel="Close drawer"
        >
          <p>Drawer content</p>
          <SegmentedControl label="Map" defaultValue="light">
            <SegmentedControl.Item value="light">Light</SegmentedControl.Item>
            <SegmentedControl.Item value="dark">Dark</SegmentedControl.Item>
          </SegmentedControl>
          <SearchableDropdown
            label="Drawer city"
            items={cities}
            selectedItem={{ label: 'Oslo', value: 'Oslo' }}
            onChange={() => undefined}
            clearable={false}
          />
          <Popover>
            <PopoverTrigger>
              <button>Drawer options</button>
            </PopoverTrigger>
            <PopoverContent>
              <label>
                Drawer note
                <input />
              </label>
            </PopoverContent>
          </Popover>
          <OverflowMenu
            button={<button>Drawer actions</button>}
            aria-label="Drawer actions"
          >
            <OverflowMenuItem onSelect={() => undefined}>
              Share
            </OverflowMenuItem>
          </OverflowMenu>
        </Drawer>
        <SearchableDropdown
          label="Search city"
          items={cities}
          selectedItem={null}
          onChange={() => undefined}
        />
        <DatePicker
          label="Date"
          selectedDate={date}
          onChange={value => setDate(value as CalendarDate | null)}
          locale="en-GB"
        />
        <OverflowMenu button={<button>Actions</button>} aria-label="Actions">
          <OverflowMenuItem onSelect={() => undefined}>Edit</OverflowMenuItem>
        </OverflowMenu>
        <Popover>
          <PopoverTrigger>
            <button>Options</button>
          </PopoverTrigger>
          <PopoverContent>
            <label>
              Note
              <input />
            </label>
            <Dropdown
              label="Popover city"
              items={cities}
              selectedItem={null}
              onChange={() => undefined}
            />
          </PopoverContent>
        </Popover>
        <Tooltip
          content="Save your changes"
          placement="bottom"
          disableKeyboardListener={false}
        >
          <button>Save</button>
        </Tooltip>
      </Modal>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<Fixture />);
