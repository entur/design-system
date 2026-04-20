import React from 'react';

import { DownwardIcon, UpwardIcon } from '@entur/icons';

type DataCardProps = {
  value: string;
  label: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  small?: boolean;
  sublabel?: string;
  className?: string;
  labelFirst?: boolean;
};

const DataCard: React.FC<DataCardProps> = ({
  value,
  label,
  change,
  trend,
  small,
  sublabel,
  className,
  labelFirst,
}) => {
  return (
    <div
      className={`data-card ${small ? 'data-card--small' : ''} ${
        className ?? ''
      }`}
    >
      <span
        className={`data-card__value ${small ? 'data-card__value--small' : ''}`}
      >
        {value}
      </span>
      <span
        className={`data-card__label ${
          labelFirst ? 'data-card__label--first' : ''
        }`}
      >
        {label}
      </span>
      {sublabel && <span className="data-card__sublabel">{sublabel}</span>}
      {change && (
        <span
          className={`data-card__change ${
            trend ? `data-card__change--${trend}` : ''
          }`}
        >
          {trend === 'up' && <UpwardIcon inline size={12} />}
          {trend === 'down' && <DownwardIcon inline size={12} />} {change}
        </span>
      )}
    </div>
  );
};

export default DataCard;
