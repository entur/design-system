import React from 'react';

import { UpwardIcon, DownwardIcon } from '@entur/icons';

type DataCardProps = {
  value: string;
  label: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  small?: boolean;
  sublabel?: string;
};

const DataCard: React.FC<DataCardProps> = ({
  value,
  label,
  change,
  trend,
  small,
  sublabel,
}) => {
  return (
    <div className={`data-card ${small ? 'data-card--small' : ''}`}>
      <span
        className={`data-card__value ${small ? 'data-card__value--small' : ''}`}
      >
        {value}
      </span>
      <span className="data-card__label">{label}</span>
      {sublabel && <span className="data-card__sublabel">{sublabel}</span>}
      {change && (
        <span
          className={`data-card__change ${trend ? `data-card__change--${trend}` : ''}`}
        >
          {trend === 'up' && <UpwardIcon inline size={12} />}
          {trend === 'down' && <DownwardIcon inline size={12} />}
          {' '}
          {change}
        </span>
      )}
    </div>
  );
};

export default DataCard;
