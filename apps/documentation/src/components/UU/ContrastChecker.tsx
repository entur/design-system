import React from 'react';
import { hex } from 'wcag-contrast';
import { colors } from '@entur/tokens';
import {
  NormalizedDropdownItemType,
  SearchableDropdown,
} from '@entur/dropdown';
import { SecondarySquareButton } from '@entur/button';
import { flatten } from '../../utils/flatten';
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
} from '@entur/icons';
import { Heading, Text } from '@entur/typography/beta';
import { CopyButton } from './CopyButton';
import './ContrastChecker.scss';

function ContrastChecker(): React.ReactNode {
  const flattenedColorMap = flatten(colors);
  const colorList: NormalizedDropdownItemType[] = [];
  for (const [key, value] of Object.entries(flattenedColorMap)) {
    if (value in colorList === false) {
      colorList.push({
        label: key,
        value: value,
      } as NormalizedDropdownItemType);
    }
  }
  const [textColor, setTextColor] = React.useState(colorList[0]);
  const [backgroundColor, setBackgroundColor] =
    React.useState<NormalizedDropdownItemType>(colorList[1]);
  const score = Number(hex(textColor.value, backgroundColor.value))
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
        <div className="color-pickers-container">
          <div className="color-picker-wrapper">
            <SearchableDropdown
              label="Forgrunn"
              items={colorList}
              selectedItem={textColor}
              onChange={item =>
                item && setTextColor({ value: item.value, label: item.label })
              }
              clearable={false}
            />
            <ColorValues
              color={textColor.label}
              hex={textColor.value}
            ></ColorValues>
          </div>
          <SecondarySquareButton
            onClick={SwitchColors}
            className="color-picker__switch-button"
          >
            <SwitchIcon aria-label="Bytt forgrunn- og bakgrunnfarge" />
          </SecondarySquareButton>
          <div className="color-picker-wrapper">
            <SearchableDropdown
              items={colorList}
              label="Bakgrunn"
              selectedItem={backgroundColor}
              onChange={item =>
                item === null ? undefined : setBackgroundColor(item)
              }
              clearable={false}
            />
            <ColorValues
              color={backgroundColor.label}
              hex={backgroundColor.value}
            />
          </div>
        </div>
        <div
          className="contrast-checker__ratio"
          style={{
            borderColor: WCAGTest('aasmall')
              ? colors.validation.mint
              : colors.validation.lava,
          }}
        >
          <div className="contrast-checker__ratio-header">Kontrastforhold</div>
          <div className="contrast-checker__ratio-ratio" aria-live="polite">
            {score}:1
          </div>
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
              color: textColor.value,
              background: backgroundColor.value,
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
              color: textColor.value,
              background: backgroundColor.value,
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
              color: textColor.value,
              background: backgroundColor.value,
            }}
          >
            <ValidTicketIcon />
          </div>
        </div>
      </div>
    </div>
  );
}

const ColorValues: React.FC<{ color: string; hex: string }> = ({
  color,
  hex,
}) => {
  // Narrow buttons break the token name after a dot, not in the middle of a word
  const tokenName = color.split('.').map((part, index) => (
    <React.Fragment key={index}>
      {index > 0 && (
        <>
          .<wbr />
        </>
      )}
      {part}
    </React.Fragment>
  ));
  // Each name is followed by its value, so screen readers read them in pairs
  return (
    <dl className="color-values">
      <div className="color-values__row">
        <dt>HEX</dt>
        <dd>
          <Text variant="code">{hex}</Text>
        </dd>
      </div>
      <div className="color-values__row">
        <dt>LESS</dt>
        <dd>
          <CopyButton textToCopy={`@colors.${color}`}>{tokenName}</CopyButton>
        </dd>
      </div>
      <div className="color-values__row">
        <dt>SCSS</dt>
        <dd>
          <CopyButton textToCopy={`$colors.${color}`}>{tokenName}</CopyButton>
        </dd>
      </div>
    </dl>
  );
};

export default ContrastChecker;
