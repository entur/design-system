import React from 'react';

type BarEntry = {
  label: string;
  value: number;
  percent?: string;
  color?: string;
};

type HorizontalBarChartProps = {
  title?: string;
  data: BarEntry[];
  maxValue?: number;
  showValues?: boolean;
};

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  title,
  data,
  maxValue,
  showValues = true,
}) => {
  const max = maxValue ?? Math.max(...data.map(d => d.value));
  const srDescription = data
    .map(d => `${d.label}: ${d.value}${d.percent ? ` (${d.percent})` : ''}`)
    .join(', ');

  return (
    <div
      className="bar-chart"
      role="img"
      aria-label={`${title ?? 'Søylediagram'}. ${srDescription}`}
    >
      {title && (
        <h4 className="bar-chart__title" aria-hidden="true">
          {title}
        </h4>
      )}
      <div className="bar-chart__bars" aria-hidden="true">
        {data.map(item => (
          <div className="bar-chart__row" key={item.label}>
            <span className="bar-chart__label">{item.label}</span>
            <div className="bar-chart__track">
              <div
                className="bar-chart__fill"
                style={{
                  width: `${(item.value / max) * 100}%`,
                  ...(item.color ? { background: item.color } : {}),
                }}
              >
                {showValues && (
                  <span className="bar-chart__value">{item.value}</span>
                )}
              </div>
            </div>
            {item.percent && (
              <span className="bar-chart__percent">{item.percent}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalBarChart;
