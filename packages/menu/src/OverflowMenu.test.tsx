import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import {
  OverflowMenu,
  OverflowMenuItem,
  OverflowMenuLink,
} from './OverflowMenu';

function simulateMouseClick(element: HTMLElement) {
  fireEvent.pointerDown(element, { pointerType: 'mouse' });
  fireEvent.mouseDown(element);
  fireEvent.pointerUp(element, { pointerType: 'mouse' });
  fireEvent.mouseUp(element);
  fireEvent.click(element);
}

test('OverflowMenu renders, and items are clickable', () => {
  const FirstItemSpy = jest.fn();
  const SecondItemSpy = jest.fn();

  const button = 'button';
  const { getByTestId } = render(
    <OverflowMenu data-testid={button}>
      <OverflowMenuItem data-testid="first" onSelect={() => FirstItemSpy()}>
        Info
      </OverflowMenuItem>
      <OverflowMenuLink data-testid="second" onSelect={() => SecondItemSpy()}>
        Link
      </OverflowMenuLink>
    </OverflowMenu>,
  );

  const menuButton = getByTestId('button');
  expect(menuButton).toBeInTheDocument();
  simulateMouseClick(menuButton);

  const firstItem = getByTestId('first');
  expect(firstItem).toBeVisible();
});
