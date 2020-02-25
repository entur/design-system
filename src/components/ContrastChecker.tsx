import React from 'react';
import { hex } from 'wcag-contrast';
import { colors } from '@entur/tokens';
import { Dropdown } from '@entur/dropdown';
import { SecondarySquareButton } from '@entur/button';
import { flatten } from '~/utils/flatten';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/table';
import { CheckIcon, CloseIcon, SwitchIcon, TicketIcon } from '@entur/icons';
import { Heading4, CodeText } from '@entur/typography/dist';
import { CopyButton } from './CopyButton';
import './ContrastChecker.scss';

function ContrastChecker() {
  const flattenedColorMap = flatten(colors);
  const colorList = [];
  for (let [key, value] of Object.entries(flattenedColorMap)) {
    if (value in colorList === false) {
      colorList.push({ label: key, value: value });
    }
  }
  const [textColor, setTextColor] = React.useState(colorList[0]);
  const [backgroundColor, setBackgroundColor] = React.useState(colorList[1]);
  let score: string;
  score = Number(hex(textColor.value, backgroundColor.value))
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
            <Dropdown
              label="Forgrunn"
              items={colorList}
              onChange={item =>
                setTextColor({ value: item!.value, label: item!.label })
              }
              placeholder={textColor.label}
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
            <SwitchIcon />
          </SecondarySquareButton>
          <div className="color-picker-wrapper">
            <Dropdown
              items={colorList}
              label="Bakgrunn"
              onChange={item =>
                setBackgroundColor({ value: item!.value, label: item!.label })
              }
              placeholder={backgroundColor.label}
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
          <div className="contrast-checker__ratio-header">Contrast Ratio:</div>
          <div className="contrast-checker__ratio-ratio">{score}:1</div>
        </div>
      </div>
      <Table compact>
        <TableHead>
          <TableRow>
            <HeaderCell>Navn</HeaderCell>
            <HeaderCell>Normal tekst</HeaderCell>
            <HeaderCell>Stor tekst (18pt +)</HeaderCell>
            <HeaderCell>Grafisk objeckt</HeaderCell>
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
      <div className="contrast-preview__container">
        <div>
          <Heading4>Normal tekst</Heading4>
          <div
            className="contrast-preview__small-text"
            style={{
              color: textColor.value,
              background: backgroundColor.value,
            }}
          >
            Vi samler kollektiv-Norge
          </div>
          <Heading4>Stor tekst</Heading4>
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
          <Heading4>Grafisk objekt</Heading4>
          <div
            className="contrast-preview__graphics-object"
            style={{
              color: textColor.value,
              background: backgroundColor.value,
            }}
          >
            <TicketIcon />
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
  return (
    <div className="color-values__wrapper">
      <div className="color-values__names">
        <div>HEX</div>
        <div>LESS</div>
        <div>SCSS</div>
      </div>

      <div className="color-values__values">
        <CodeText>{hex}</CodeText>
        <div>
          <CopyButton textToCopy={`@colors.${color}`}>{color}</CopyButton>
        </div>
        <div>
          <CopyButton textToCopy={`$colors.${color}`}>{color}</CopyButton>
        </div>
      </div>
    </div>
  );
};

export default ContrastChecker;
