import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import { Tooltip } from '.';

test('Tooltip renders with content and children, and is displayed on mouse-over', async () => {
  jest.useFakeTimers();

  const content = 'tooltipcontent';
  const children = 'Tooltip children';

  const { getByText, queryByText } = render(
    <Tooltip content={content} className="tester" placement="bottom">
      <span>{children}</span>
    </Tooltip>,
  );

  const tooltipdiv = getByText(children);

  expect(queryByText(content)).not.toBeVisible();
  fireEvent.mouseEnter(tooltipdiv);
  act(() => {
    jest.runAllTimers();
  });

  expect(queryByText(content)).toBeVisible();

  expect(getByText(content)).toHaveClass('tester');

  fireEvent.mouseLeave(tooltipdiv);
  act(() => {
    jest.runAllTimers();
  });

  expect(queryByText(content)).not.toBeVisible();

  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
