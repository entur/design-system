import React from 'react';
import { DataHue, DataTier, dataColorVar, dataHues } from './dataPalette';

import './DataCharts.scss';

type ChartProps = {
  tier: DataTier;
  /** Describes the chart for screen readers */
  title: string;
};

const fill = (tier: DataTier, hue: DataHue) => dataColorVar(tier, hue);

const Svg: React.FC<
  ChartProps & { viewBox: string; children: React.ReactNode }
> = ({ tier, title, viewBox, children }) => (
  <svg
    className={`data-chart data-chart--${tier}`}
    viewBox={viewBox}
    role="img"
    aria-label={title}
    preserveAspectRatio="xMidYMid meet"
  >
    {children}
  </svg>
);

const Axis: React.FC<{ x1: number; x2: number; y: number }> = ({
  x1,
  x2,
  y,
}) => <line className="data-chart__axis" x1={x1} x2={x2} y1={y} y2={y} />;

/** Two data series, so only the two highest ranked hues are used. */
export const DataBarChart: React.FC<ChartProps> = ({ tier, title }) => {
  const bars = [
    { label: 'Buss', value: 68, hue: 'blue' as const },
    { label: 'Tog', value: 41, hue: 'coral' as const },
  ];
  const max = 80;
  const baseline = 230;
  const height = (value: number) => (value / max) * 180;

  return (
    <Svg tier={tier} title={title} viewBox="0 0 400 280">
      {bars.map(({ label, value, hue }, index) => {
        const x = 90 + index * 140;
        const barHeight = height(value);
        return (
          <g key={label}>
            <text
              className="data-chart__value"
              x={x + 45}
              y={baseline - barHeight - 12}
            >
              {value}
            </text>
            <rect
              x={x}
              y={baseline - barHeight}
              width={90}
              height={barHeight}
              fill={fill(tier, hue)}
            />
            <text className="data-chart__label" x={x + 45} y={baseline + 26}>
              {label}
            </text>
          </g>
        );
      })}
      <Axis x1={60} x2={340} y={baseline} />
    </Svg>
  );
};

/** Several categories, weighted so the two highest ranked hues dominate. */
export const DataPieChart: React.FC<ChartProps> = ({ tier, title }) => {
  const slices = [
    { label: 'Buss', value: 42, hue: 'blue' as const },
    { label: 'Tog', value: 27, hue: 'coral' as const },
    { label: 'Trikk', value: 14, hue: 'jungle' as const },
    { label: 'Ferge', value: 11, hue: 'azure' as const },
    { label: 'Annet', value: 6, hue: 'lavender' as const },
  ];
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const cx = 140;
  const cy = 140;
  const r = 110;

  let angle = -Math.PI / 2;
  const paths = slices.map(({ label, value, hue }) => {
    const sweep = (value / total) * Math.PI * 2;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    angle += sweep;
    const x2 = cx + r * Math.cos(angle);
    const y2 = cy + r * Math.sin(angle);
    const largeArc = sweep > Math.PI ? 1 : 0;
    return (
      <path
        key={label}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={fill(tier, hue)}
      />
    );
  });

  return (
    <Svg tier={tier} title={title} viewBox="0 0 440 280">
      {paths}
      {slices.map(({ label, value, hue }, index) => {
        const y = 46 + index * 40;
        return (
          <g key={label}>
            <rect
              x={286}
              y={y - 14}
              width={18}
              height={18}
              rx={3}
              fill={fill(tier, hue)}
            />
            <text
              className="data-chart__label data-chart__label--start"
              x={316}
              y={y}
            >
              {label} {value} %
            </text>
          </g>
        );
      })}
    </Svg>
  );
};

/** A line chart gives every series the same visual weight. */
export const DataLineChart: React.FC<ChartProps> = ({ tier, title }) => {
  const series = [
    { label: 'Buss', hue: 'blue' as const, points: [28, 42, 38, 55, 62, 71] },
    { label: 'Tog', hue: 'coral' as const, points: [52, 48, 57, 44, 49, 58] },
    {
      label: 'Trikk',
      hue: 'jungle' as const,
      points: [18, 24, 31, 29, 38, 44],
    },
    { label: 'Ferge', hue: 'azure' as const, points: [64, 58, 46, 40, 33, 26] },
  ];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun'];
  const left = 60;
  const right = 380;
  const baseline = 230;
  const max = 80;
  const x = (index: number) =>
    left + (index / (months.length - 1)) * (right - left);
  const y = (value: number) => baseline - (value / max) * 180;

  return (
    <Svg tier={tier} title={title} viewBox="0 0 440 280">
      {series.map(({ label, hue, points }) => (
        <polyline
          key={label}
          className="data-chart__line"
          points={points
            .map((value, index) => `${x(index)},${y(value)}`)
            .join(' ')}
          stroke={fill(tier, hue)}
        />
      ))}
      {months.map((month, index) => (
        <text
          key={month}
          className="data-chart__label"
          x={x(index)}
          y={baseline + 26}
        >
          {month}
        </text>
      ))}
      <Axis x1={left} x2={right} y={baseline} />
    </Svg>
  );
};

/** Many categories, so the whole palette is needed and the ranking decides the order. */
export const DataStackedBarChart: React.FC<ChartProps> = ({ tier, title }) => {
  const columns = [
    [14, 12, 10, 9, 8, 7, 6, 6, 5, 4, 4],
    [22, 8, 14, 6, 11, 5, 9, 4, 7, 3, 6],
    [9, 18, 6, 13, 5, 12, 4, 10, 3, 8, 3],
    [17, 15, 11, 7, 9, 6, 8, 5, 6, 4, 5],
  ];
  const labels = ['Q1', 'Q2', 'Q3', 'Q4'];
  const baseline = 230;
  const scale = 1.8;
  const barWidth = 64;

  return (
    <Svg tier={tier} title={title} viewBox="0 0 440 280">
      {columns.map((values, columnIndex) => {
        const x = 60 + columnIndex * 92;
        let y = baseline;
        return (
          <g key={labels[columnIndex]}>
            {values.map((value, hueIndex) => {
              const segmentHeight = value * scale;
              y -= segmentHeight;
              return (
                <rect
                  key={dataHues[hueIndex]}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={segmentHeight}
                  fill={fill(tier, dataHues[hueIndex])}
                />
              );
            })}
            <text
              className="data-chart__label"
              x={x + barWidth / 2}
              y={baseline + 26}
            >
              {labels[columnIndex]}
            </text>
          </g>
        );
      })}
      <Axis x1={50} x2={400} y={baseline} />
    </Svg>
  );
};

/** How much of each hue a typical composition should contain. */
export const DataWeighting: React.FC<ChartProps> = ({ tier, title }) => {
  const weights = [26, 20, 12, 10, 8, 7, 5, 4, 3, 3, 2];
  const max = Math.max(...weights);
  const rowHeight = 24;
  const barHeight = 16;
  const left = 40;
  const width = 360;

  return (
    <Svg
      tier={tier}
      title={title}
      viewBox={`0 0 440 ${weights.length * rowHeight + 16}`}
    >
      {weights.map((weight, index) => {
        const y = 8 + index * rowHeight;
        return (
          <g key={dataHues[index]}>
            <text className="data-chart__label" x={22} y={y + barHeight - 2}>
              {index + 1}
            </text>
            <rect
              x={left}
              y={y}
              width={(weight / max) * width}
              height={barHeight}
              fill={fill(tier, dataHues[index])}
            />
          </g>
        );
      })}
    </Svg>
  );
};

/** Text sitting on top of the fills, which is what the guideline warns against. */
export const DataTextOnShapesDont: React.FC<ChartProps> = ({ tier, title }) => {
  const bars = [
    { label: '62 %', value: 62, hue: 'blue' as const },
    { label: '48 %', value: 48, hue: 'coral' as const },
    { label: '33 %', value: 33, hue: 'jungle' as const },
  ];
  const baseline = 200;
  const max = 70;

  return (
    <Svg tier={tier} title={title} viewBox="0 0 400 240">
      {bars.map(({ label, value, hue }, index) => {
        const x = 60 + index * 100;
        const barHeight = (value / max) * 160;
        return (
          <g key={label}>
            <rect
              x={x}
              y={baseline - barHeight}
              width={70}
              height={barHeight}
              fill={fill(tier, hue)}
            />
            <text
              className="data-chart__label data-chart__label--on-shape"
              x={x + 35}
              y={baseline - barHeight + 28}
            >
              {label}
            </text>
          </g>
        );
      })}
      <Axis x1={50} x2={350} y={baseline} />
    </Svg>
  );
};

/** The ranking inverted, so the lowest ranked hues carry the most area. */
export const DataWrongWeightingDont: React.FC<ChartProps> = ({
  tier,
  title,
}) => {
  const slices = [
    { label: 'Mystic', value: 38, hue: 'mystic' as const },
    { label: 'Lime', value: 27, hue: 'lime' as const },
    { label: 'Lilac', value: 19, hue: 'lilac' as const },
    { label: 'Blue', value: 10, hue: 'blue' as const },
    { label: 'Coral', value: 6, hue: 'coral' as const },
  ];
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const cx = 200;
  const cy = 120;
  const r = 95;

  let angle = -Math.PI / 2;

  return (
    <Svg tier={tier} title={title} viewBox="0 0 400 240">
      {slices.map(({ label, value, hue }) => {
        const sweep = (value / total) * Math.PI * 2;
        const x1 = cx + r * Math.cos(angle);
        const y1 = cy + r * Math.sin(angle);
        angle += sweep;
        const x2 = cx + r * Math.cos(angle);
        const y2 = cy + r * Math.sin(angle);
        const largeArc = sweep > Math.PI ? 1 : 0;
        return (
          <path
            key={label}
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
            fill={fill(tier, hue)}
          />
        );
      })}
    </Svg>
  );
};
