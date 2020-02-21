import React from 'react';
import { hex } from 'wcag-contrast';
import { colors } from '@entur/tokens';
import { Dropdown } from '@entur/dropdown';
import { SecondarySquareButton } from '@entur/button';
import { SwitchIcon } from '@entur/icons';
import { flatten } from '~/utils/flatten';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  HeaderCell,
  DataCell,
} from '@entur/table';

function ContrastChecker() {
  const flatColors = flatten(colors);
  const lis = [];
  for (let [key, value] of Object.entries(flatColors)) {
    lis.push({ label: key, value: value });
  }
  const [text, setText] = React.useState(lis[0]);
  const [background, setBackground] = React.useState(lis[2]);
  const score = hex(text.value, background.value);

  function SwitchColors() {
    const tempText = text;
    setText(background);
    setBackground(tempText);
  }

  function WCAGTest({ type: string }) {}
  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridGap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          <Dropdown
            label="Forgrunn"
            items={lis}
            onChange={item =>
              setText({ value: item!.value, label: item!.label })
            }
            placeholder={text.label}
          />
          <SecondarySquareButton>
            <SwitchIcon onClick={SwitchColors} />
          </SecondarySquareButton>
          <Dropdown
            items={lis}
            label="Bakgrunn"
            onChange={item =>
              setBackground({ value: item!.value, label: item!.label })
            }
            placeholder={background.label}
            style={{ marginTop: '0' }}
          />
        </div>
        <div
          style={{
            color: text.value,
            background: background.value,
            border: `4px solid ${colors.blues.blue20}`,
            padding: '0.5rem',
          }}
        >
          Tekst på bakgrunn
        </div>
      </div>
      <div>
        Kontrast:{score}
        <div>{score > 4.5 ? 'WCAG AA Godkjent' : 'WCAG AA Ikke godkjent'}</div>
        <div>{score > 7 ? 'WCAG AAA Godkjent' : 'WCAG AAA Ikke godkjent'}</div>
      </div>
    </div>
  );
}

export default ContrastChecker;
