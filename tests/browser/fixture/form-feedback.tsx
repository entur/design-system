import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CalendarDate, DatePicker } from '@entur/datepicker';
import { Dropdown } from '@entur/dropdown';
import { Checkbox, TextField } from '@entur/form';

import '@entur/tokens/styles';
import '@entur/datepicker/styles';
import '@entur/dropdown/styles';
import '@entur/form/styles';
import '@entur/icons/styles';
import '@entur/typography/styles';

const cities = [
  { label: 'Oslo', value: 'osl' },
  { label: 'Bergen', value: 'bgo' },
];

function FormFeedbackFixture() {
  const [checked, setChecked] = useState(true);
  return (
    <main>
      <TextField label="Name" variant="negative" feedback="Enter a name" />
      <Dropdown
        label="City"
        items={cities}
        selectedItem={null}
        onChange={() => undefined}
        variant="negative"
        feedback="Choose a city"
      />
      <DatePicker
        label="Date"
        selectedDate={new CalendarDate(2023, 9, 15)}
        onChange={() => undefined}
        locale="en-GB"
        variant="negative"
        feedback="Choose a date"
      />
      <Checkbox
        readOnly
        checked={checked}
        onChange={event => setChecked(event.target.checked)}
      >
        Read-only option
      </Checkbox>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<FormFeedbackFixture />);
