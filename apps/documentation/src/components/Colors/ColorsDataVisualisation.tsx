import React from 'react';
import { SegmentedControl } from '@entur/form';
import { GridContainer } from '@entur/grid';
import { Contrast } from '@entur/layout';
import { borderRadiuses, data, space } from '@entur/tokens';
import { useSettings } from '@providers/SettingsContext';
import { formatVariableByType } from '../../utils/formatVariable';
import ColorSwatch from './ColorSwatch';
import {
  DataBarChart,
  DataLineChart,
  DataPieChart,
  DataStackedBarChart,
  DataWeighting,
} from './DataCharts';
import { DataTier, dataHues, dataTierLabels, dataTiers } from './dataPalette';

import './DataCharts.scss';

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

const TierPicker: React.FC<{
  tiers: readonly DataTier[];
  value: DataTier;
  onChange: (tier: DataTier) => void;
  label: string;
}> = ({ tiers, value, onChange, label }) => (
  <SegmentedControl
    label={label}
    value={value}
    onChange={tier => tier && onChange(tier as DataTier)}
    style={{ marginBottom: space.large }}
  >
    {tiers.map(tier => (
      <SegmentedControl.Item key={tier} value={tier}>
        {dataTierLabels[tier]}
      </SegmentedControl.Item>
    ))}
  </SegmentedControl>
);

const ColorsDataVisualisation: React.FC = () => {
  const [tier, setTier] = React.useState<DataTier>('standard');
  const { variableFormat, resolvedColorMode } = useSettings();
  const Wrapper = tier === 'contrast' ? Contrast : 'div';

  return (
    <>
      <TierPicker
        label="Fargenivå"
        tiers={dataTiers}
        value={tier}
        onChange={setTier}
      />
      <Wrapper
        style={{
          padding: space.medium,
          borderRadius: borderRadiuses.large,
        }}
      >
        <GridContainer spacing="large">
          {dataHues.map((hue, index) => (
            <ColorSwatch
              key={hue}
              title={capitalize(hue)}
              topLabel={`Farge ${index + 1}`}
              hex={data[resolvedColorMode][tier][hue]}
              variable={formatVariableByType(
                variableFormat,
                `${tier}-${hue}`,
                `${resolvedColorMode}.${tier}.${hue}`,
                'data',
              )}
            />
          ))}
        </GridContainer>
      </Wrapper>
    </>
  );
};

const illustrations = {
  '1': DataBarChart,
  '2': DataPieChart,
  '3': DataStackedBarChart,
  '4': DataLineChart,
  vekting: DataWeighting,
} as const;

const illustrationTitles: Record<keyof typeof illustrations, string> = {
  '1': 'Søylediagram med to dataverdier, i Blue og Coral',
  '2': 'Kakediagram med fem kategorier, med overvekt av Blue og Coral',
  '3': 'Stablet søylediagram som bruker hele paletten i rangert rekkefølge',
  '4': 'Linjediagram med fire like vektede serier',
  vekting: 'Hvor mye det bør være av hver farge, fra farge 1 til farge 11',
};

type DataIllustrationsProps = {
  illustration: keyof typeof illustrations;
};

/** The examples only cover the two tiers meant for chart fills. */
const exampleTiers = ['standard', 'contrast'] as const;

export const DataIllustrations: React.FC<DataIllustrationsProps> = ({
  illustration,
}) => {
  const [tier, setTier] = React.useState<DataTier>('standard');
  const Chart = illustrations[illustration];
  const Wrapper = tier === 'contrast' ? Contrast : 'div';

  return (
    <>
      <TierPicker
        label="Fargenivå"
        tiers={exampleTiers}
        value={tier}
        onChange={setTier}
      />
      <Wrapper
        className={`data-chart-example__surface data-chart-example__surface--${tier}`}
      >
        <Chart tier={tier} title={illustrationTitles[illustration]} />
      </Wrapper>
    </>
  );
};

export default ColorsDataVisualisation;
