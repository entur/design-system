import React from 'react';

type TrendBarChartProps = {
  title: string;
  years: string[];
  values: string[];
  maxValue: number;
  isPercent?: boolean;
};

const TrendBarChart: React.FC<TrendBarChartProps> = ({
  title,
  years,
  values,
  maxValue,
  isPercent,
}) => {
  const srDescription = years
    .map((year, i) => `${year}: ${values[i]}`)
    .join(', ');

  return (
    <div
      className="trend-bar"
      role="img"
      aria-label={`${title}. ${srDescription}`}
    >
      <h4 className="trend-bar__title" aria-hidden="true">
        {title}
      </h4>
      <div className="trend-bar__rows" aria-hidden="true">
        {years.map((year, i) => {
          const raw = parseFloat(values[i].replace('%', ''));
          const pct = isPercent ? raw : (raw / maxValue) * 100;
          return (
            <div className="trend-bar__row" key={year}>
              <span className="trend-bar__year">{year}</span>
              <div className="trend-bar__track">
                <div className="trend-bar__fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="trend-bar__value">{values[i]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendBarChart;
