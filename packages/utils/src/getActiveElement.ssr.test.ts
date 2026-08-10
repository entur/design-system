/**
 * @jest-environment node
 */
import { getActiveElement } from './getActiveElement';

describe('getActiveElement without a DOM', () => {
  test('returns null instead of throwing, so server rendering is safe', () => {
    expect(getActiveElement()).toBeNull();
  });
});
