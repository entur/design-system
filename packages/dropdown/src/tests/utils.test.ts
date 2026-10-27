import { getSelectionStatusMessage } from '../utils';

const oslo = { value: 'Oslo', label: 'Oslo' };
const bergen = { value: 'Bergen', label: 'Bergen' };
const trondheim = { value: 'Trondheim', label: 'Trondheim' };

const labels = {
  ariaLabelChosenSingular: 'valgt',
  ariaLabelAddedPlural: 'lagt til',
  ariaLabelChosenTotal: 'valgte totalt',
  ariaLabelRemovedSingular: 'fjernet',
  ariaLabelRemovedPlural: 'valg fjernet',
};

describe('getSelectionStatusMessage', () => {
  test.each([
    ['one item selected', [], [oslo], 'Oslo valgt'],
    [
      'several items selected',
      [oslo],
      [oslo, bergen, trondheim],
      '2 lagt til, 3 valgte totalt',
    ],
    ['one item removed', [oslo, bergen], [bergen], 'Oslo fjernet'],
    ['several items removed', [oslo, bergen], [], '2 valg fjernet'],
    [
      'items selected and another removed',
      [oslo],
      [bergen, trondheim],
      '2 lagt til, 2 valgte totalt, Oslo fjernet',
    ],
    ['nothing changed', [oslo], [oslo], ''],
  ])('%s', (_, previousSelectedItems, selectedItems, expected) => {
    expect(
      getSelectionStatusMessage({
        previousSelectedItems,
        selectedItems,
        ...labels,
      }),
    ).toBe(expected);
  });
});
