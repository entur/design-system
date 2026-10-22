import { fireEvent, render } from '@testing-library/react';

import { Popover, PopoverContent, PopoverTrigger } from '.';

test('Popover uses fixed positioning', () => {
  const { getByRole, getByText } = render(
    <Popover>
      <PopoverTrigger>
        <button>Åpne</button>
      </PopoverTrigger>
      <PopoverContent>Innhold</PopoverContent>
    </Popover>,
  );

  fireEvent.click(getByText('Åpne'));

  expect(getByRole('dialog')).toHaveStyle({ position: 'fixed' });
});
