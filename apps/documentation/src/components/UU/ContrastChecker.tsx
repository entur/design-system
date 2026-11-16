import React from 'react';
import classNames from 'classnames';
import { hex } from 'wcag-contrast';
import { colors } from '@entur/tokens';
import { CopyableText } from '@entur/alert';
import {
  NormalizedDropdownItemType,
  SearchableDropdown,
} from '@entur/dropdown';
import { SecondarySquareButton } from '@entur/button';
import { FilterChip } from '@entur/chip';
import { Fieldset } from '@entur/form';
import {
  ContrastColor,
  ColorGroup,
  colorGroups,
  contrastColors,
  resolveCssName,
} from './contrastCheckerColors';
import {
  DataCell,
  HeaderCell,
  Table,
  TableBody,
  TableHead,
  TableRow,
} from '@entur/table';
import {
  CheckIcon,
  CloseIcon,
  SwitchIcon,
  ValidTicketIcon,
  ValidationErrorFilledIcon,
  ValidationExclamationFilledIcon,
  ValidationSuccessFilledIcon,
} from '@entur/icons';
import { Heading } from '@entur/typography/beta';
import './ContrastChecker.scss';

// Shows the colour next to its name in the dropdown list
const colorSwatch = (color: string) => {
  const ColorSwatch = ({ className }: { className?: string }) => (
    <span
      aria-hidden="true"
      className={classNames('contrast-checker__swatch', className)}
      style={{ backgroundColor: color }}
    />
  );
  ColorSwatch.displayName = `ColorSwatch(${color})`;
  return ColorSwatch;
};

// Built once, so each swatch stays the same component between renders
const swatches = new Map(
  contrastColors.map(color => [color.label, colorSwatch(color.hex)]),
);

// Many tokens share a hex value, so the label is the value
const toItems = (
  resolveName: (name: string) => string,
): NormalizedDropdownItemType[] =>
  contrastColors.map(color => ({
    label: color.cssName
      ? color.label.replace(color.cssName, resolveName(color.cssName))
      : color.label,
    value: color.label,
    icons: [swatches.get(color.label)!],
  }));
const colorList = toItems(name => name);
const colorByLabel = new Map(contrastColors.map(color => [color.label, color]));
const findColor = (item: NormalizedDropdownItemType) =>
  colorByLabel.get(item.value) as ContrastColor;

const useIsClient = () => {
  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => setIsClient(true), []);
  return isClient;
};

const defaultColor = (label: string) =>
  colorList.find(item => item.value === label) ?? colorList[0];

function ContrastChecker(): React.ReactNode {
  // The real CSS names are only known in the browser
  const isClient = useIsClient();
  const [shownGroups, setShownGroups] = React.useState<ColorGroup[]>([
    'base',
    'semantic',
    'data',
  ]);
  const toggleGroup = (group: ColorGroup, shown: boolean) =>
    setShownGroups(groups =>
      shown ? [...groups, group] : groups.filter(g => g !== group),
    );
  const items = React.useMemo(
    () =>
      (isClient ? toItems(resolveCssName) : colorList).filter(item =>
        shownGroups.includes(findColor(item).group),
      ),
    [isClient, shownGroups],
  );
  const [textColor, setTextColor] = React.useState(
    defaultColor('basecolors-text-accent'),
  );
  const [backgroundColor, setBackgroundColor] = React.useState(
    defaultColor('basecolors-frame-default'),
  );
  const score = Number(
    hex(findColor(textColor).hex, findColor(backgroundColor).hex),
  )
    .toFixed(1)
    .toString();

  function SwitchColors() {
    const tempText = textColor;
    setTextColor(backgroundColor);
    setBackgroundColor(tempText);
  }

  function WCAGTest(wcagType: string) {
    switch (wcagType) {
      case 'aasmall':
        return Number(score) >= 4.5;
      case 'aalarge':
        return Number(score) >= 3;
      case 'aaalarge':
        return Number(score) >= 4.5;
      case 'aaasmall':
        return Number(score) >= 7;
      case 'graphic':
        return Number(score) >= 3;
    }
  }
  // Three levels, each with its own icon shape
  const verdict = WCAGTest('aasmall')
    ? {
        Icon: ValidationSuccessFilledIcon,
        color: colors.validation.mint,
        text: 'Godkjent for all tekst (AA)',
      }
    : WCAGTest('aalarge')
    ? {
        Icon: ValidationExclamationFilledIcon,
        color: colors.validation.canary,
        text: 'Bare godkjent for stor tekst og grafiske objekter (AA)',
      }
    : {
        Icon: ValidationErrorFilledIcon,
        color: colors.validation.lava,
        text: 'Ikke godkjent (AA)',
      };

  function Innafor() {
    return (
      <>
        <CheckIcon
          inline
          style={{ color: colors.validation.mint, marginRight: '0.5rem' }}
          aria-hidden="true"
        />
        Innafor
      </>
    );
  }

  function Uttafor() {
    return (
      <>
        <CloseIcon
          inline
          style={{ color: colors.validation.lava, marginRight: '0.5rem' }}
          aria-hidden="true"
        />
        Uttafor
      </>
    );
  }

  return (
    <div className="contrast-checker__container">
      <div className="contrast-checker__calculator">
        <Fieldset label="Vis farger fra" className="contrast-checker__groups">
          {colorGroups.map(group => (
            <FilterChip
              key={group.value}
              value={group.value}
              checked={shownGroups.includes(group.value)}
              onChange={e => toggleGroup(group.value, e.target.checked)}
            >
              {group.label}
            </FilterChip>
          ))}
        </Fieldset>
        <div className="color-pickers-container">
          <div className="color-picker-wrapper">
            <SearchableDropdown
              label="Forgrunn"
              items={items}
              selectedItem={textColor}
              onChange={item => item && setTextColor(item)}
              clearable={false}
            />
            <ColorValues color={findColor(textColor)} />
          </div>
          <SecondarySquareButton
            onClick={SwitchColors}
            className="color-picker__switch-button"
          >
            <SwitchIcon aria-label="Bytt forgrunn- og bakgrunnfarge" />
          </SecondarySquareButton>
          <div className="color-picker-wrapper">
            <SearchableDropdown
              items={items}
              label="Bakgrunn"
              selectedItem={backgroundColor}
              onChange={item => item && setBackgroundColor(item)}
              clearable={false}
            />
            <ColorValues color={findColor(backgroundColor)} />
          </div>
        </div>
        {/* The verdict is told with icon and text too, not only the border colour */}
        <div
          className="contrast-checker__ratio"
          style={{ borderColor: verdict.color }}
          aria-live="polite"
          aria-atomic="true"
        >
          <div>
            <div className="contrast-checker__ratio-header">
              Kontrastforhold
            </div>
            <div className="contrast-checker__ratio-verdict">
              <verdict.Icon
                aria-hidden="true"
                style={{ color: verdict.color }}
              />
              {verdict.text}
            </div>
          </div>
          <div className="contrast-checker__ratio-ratio">{score}:1</div>
        </div>
      </div>
      {/* Scrolls on narrow screens instead of running out of the page */}
      <div
        className="contrast-checker__results"
        role="region"
        aria-label="Resultat"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Safari only scrolls the table by keyboard when it can be focused
        tabIndex={0}
      >
        <Table spacing="middle">
          <TableHead>
            <TableRow>
              <HeaderCell>Navn</HeaderCell>
              <HeaderCell>Normal tekst</HeaderCell>
              <HeaderCell>Stor tekst (18pt +)</HeaderCell>
              <HeaderCell>Grafisk objekt</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <DataCell>WCAG AA</DataCell>
              <DataCell>
                {WCAGTest('aasmall') ? <Innafor /> : <Uttafor />}
              </DataCell>
              <DataCell>
                {WCAGTest('aalarge') ? <Innafor /> : <Uttafor />}
              </DataCell>
              <DataCell>
                {WCAGTest('graphic') ? <Innafor /> : <Uttafor />}
              </DataCell>
            </TableRow>
            <TableRow>
              <DataCell>WCAG AAA</DataCell>
              <DataCell>
                {WCAGTest('aaasmall') ? <Innafor /> : <Uttafor />}
              </DataCell>
              <DataCell>
                {WCAGTest('aaalarge') ? <Innafor /> : <Uttafor />}
              </DataCell>
              <DataCell>
                {WCAGTest('graphic') ? <Innafor /> : <Uttafor />}
              </DataCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div aria-hidden="true" className="contrast-preview__container">
        <div>
          <Heading as="h3" variant="subtitle-2" spacing={{ top: 'xl' }}>
            Normal tekst
          </Heading>
          <div
            className="contrast-preview__small-text"
            style={{
              color: findColor(textColor).hex,
              background: findColor(backgroundColor).hex,
            }}
          >
            Vi samler kollektiv-Norge
          </div>
          <Heading as="h3" variant="subtitle-2" spacing={{ top: 'xl' }}>
            Stor tekst
          </Heading>
          <div
            className="contrast-preview__large-text"
            style={{
              color: findColor(textColor).hex,
              background: findColor(backgroundColor).hex,
            }}
          >
            Vi samler kollektiv-Norge
          </div>
        </div>
        <div>
          <Heading as="h3" variant="subtitle-2" spacing={{ top: 'xl' }}>
            Grafisk objekt
          </Heading>
          <div
            className="contrast-preview__graphics-object"
            style={{
              color: findColor(textColor).hex,
              background: findColor(backgroundColor).hex,
            }}
          >
            <ValidTicketIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

const ColorValues: React.FC<{ color: ContrastColor }> = ({ color }) => {
  const isClient = useIsClient();
  const formats = color.formats(isClient ? resolveCssName : name => name);
  // Variables first, since we would rather not have hex values in code. Each name is followed by its value, so screen readers read them in pairs
  return (
    <dl className="color-values">
      {[...formats, ['HEX', color.hex]].map(([format, value]) => (
        <div className="color-values__row" key={format}>
          <dt>{format}</dt>
          <dd>
            <CopyableText size="small">{value}</CopyableText>
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default ContrastChecker;
