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
  return (
    <div className="trend-bar">
      <h4 className="trend-bar__title">{title}</h4>
      <div className="trend-bar__rows">
        {years.map((year, i) => {
          const raw = parseFloat(values[i].replace('%', ''));
          const pct = isPercent ? raw : (raw / maxValue) * 100;
          return (
            <div className="trend-bar__row" key={year}>
              <span className="trend-bar__year">{year}</span>
              <div className="trend-bar__track">
                <div
                  className="trend-bar__fill"
                  style={{ width: `${pct}%` }}
                />
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
