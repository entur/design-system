import { getSelectionStatusMessage } from '../utils';

const oslo = { value: 'Oslo', label: 'Oslo' };
const bergen = { value: 'Bergen', label: 'Bergen' };
const trondheim = { value: 'Trondheim', label: 'Trondheim' };

const labels = {
  labelAllItemsSelected: 'Alle valgt',
  ariaLabelChosenSingular: 'valgt',
  ariaLabelChosenPlural: 'valgte',
  ariaLabelRemovedSingular: 'fjernet',
  ariaLabelRemovedPlural: 'valg fjernet',
};

describe('getSelectionStatusMessage', () => {
  test.each([
    ['one item selected', [], [oslo], false, 'Oslo valgt'],
    ['several items selected', [], [oslo, bergen], false, '2 valgte'],
    ['every item selected', [], [oslo, bergen], true, 'Alle valgt'],
    [
      'the last item selected with «Velg alle»',
      [oslo],
      [oslo, bergen],
      true,
      'Alle valgt',
    ],
    ['one item removed', [oslo, bergen], [bergen], false, 'Oslo fjernet'],
    ['several items removed', [oslo, bergen], [], false, '2 valg fjernet'],
    [
      'an item selected and another removed',
      [oslo],
      [bergen, trondheim],
      false,
      '2 valgte, Oslo fjernet',
    ],
    ['nothing changed', [oslo], [oslo], false, ''],
  ])(
    '%s',
    (_, previousSelectedItems, selectedItems, allItemsSelected, expected) => {
      expect(
        getSelectionStatusMessage({
          previousSelectedItems,
          selectedItems,
          allItemsSelected,
          ...labels,
        }),
      ).toBe(expected);
    },
  );
});
