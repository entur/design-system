import React from 'react';

import type { SatisfactionEntry } from './surveyData';

const SEGMENT_COLORS = [
  'var(--survey-color-very-satisfied)',
  'var(--survey-color-satisfied)',
  'var(--survey-color-somewhat)',
  'var(--survey-color-dissatisfied)',
];

type StackedBarProps = {
  item: SatisfactionEntry;
};

export const StackedBar: React.FC<StackedBarProps> = ({ item }) => {
  const total = item.segments.reduce((a, b) => a + b, 0);

  return (
    <div className="stacked-bar">
      <div className="stacked-bar__header">
        <span className="stacked-bar__label">
          {item.label} — {item.score}
        </span>
        <span className="stacked-bar__users">{item.users}</span>
      </div>
      <div className="stacked-bar__track">
        {item.segments.map((seg, i) =>
          seg > 0 ? (
            <div
              key={i}
              className="stacked-bar__segment"
              style={{
                width: `${(seg / total) * 100}%`,
                backgroundColor: SEGMENT_COLORS[i],
              }}
            >
              <span className="stacked-bar__segment-value">{seg}</span>
            </div>
          ) : null,
        )}
      </div>
    </div>
  );
};

type StackedBarLegendProps = {
  labels: string[];
};

export const StackedBarLegend: React.FC<StackedBarLegendProps> = ({
  labels,
}) => {
  return (
    <div className="stacked-bar-legend">
      {labels.map((label, i) => (
        <div className="stacked-bar-legend__item" key={i}>
          <span
            className="stacked-bar-legend__dot"
            style={{ backgroundColor: SEGMENT_COLORS[i] }}
          />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};
