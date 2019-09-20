import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Tooltip from './';

test('Tooltip renders with content and children, and is displayed on mouse-over', () => {
  const content = 'tooltipcontent';
  const children = 'Tooltip children';

  const { getByText } = render(
    <Tooltip content={content} placement="top" className="testerclass">
      {children}
    </Tooltip>,
  );

  const tooltipdiv = getByText(content);
  expect(tooltipdiv).toHaveAttribute('aria-hidden', 'true');

  fireEvent.mouseOver(getByText(children));
  expect(tooltipdiv).toHaveAttribute('aria-hidden', 'false');
  expect(tooltipdiv).toHaveClass('testerclass');

  expect(tooltipdiv).toHaveClass('entur-tooltip--top');
  fireEvent.mouseLeave(getByText(children));

  expect(tooltipdiv).toHaveAttribute('aria-hidden', 'true');
});
