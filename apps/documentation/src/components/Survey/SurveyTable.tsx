import React from 'react';

import type { TrendRow } from './surveyData';

type SurveyTableProps = {
  title: string;
  headers: string[];
  rows: TrendRow[];
};

const getTrendVariant = (trend: string): string => {
  if (trend.includes('Stabil') || trend.includes('↔'))
    return 'survey-table__trend-badge--stable';
  if (trend.includes('↓')) return 'survey-table__trend-badge--down';
  if (trend.includes('↕')) return 'survey-table__trend-badge--variable';
  return '';
};

const SurveyTable: React.FC<SurveyTableProps> = ({
  title,
  headers,
  rows,
}) => {
  return (
    <div className="survey-table">
      <h4 className="survey-table__title">{title}</h4>
      <div className="survey-table__wrapper">
        <table className="survey-table__table">
          <thead>
            <tr>
              {headers.map(h => (
                <th className="survey-table__header-cell" key={h}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.label}>
                <td className="survey-table__cell survey-table__label">
                  {row.label}
                </td>
                {row.values.map((v, i) => (
                  <td className="survey-table__cell" key={i}>
                    {v ?? '—'}
                  </td>
                ))}
                <td className="survey-table__cell">
                  <span
                    className={`survey-table__trend-badge ${getTrendVariant(row.trend)}`}
                  >
                    {row.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SurveyTable;
