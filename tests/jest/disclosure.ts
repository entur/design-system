import { isInaccessible } from '@testing-library/react';

/** Returns the element a disclosure button references through aria-controls. */
export function getControlledElement(trigger: HTMLElement) {
  const id = trigger.getAttribute('aria-controls');
  if (!id) throw new Error('Trigger has no aria-controls');
  const element = document.getElementById(id);
  if (!element) throw new Error(`No element with id "${id}"`);
  return element;
}

/** Collapsed content stays mounted but is hidden from assistive technology and inert. */
export function expectCollapsed(content: HTMLElement) {
  expect(isInaccessible(content)).toBe(true);
  expect(content.closest('[inert]')).not.toBeNull();
}

export function expectExpanded(content: HTMLElement) {
  expect(isInaccessible(content)).toBe(false);
  expect(content.closest('[inert]')).toBeNull();
}
