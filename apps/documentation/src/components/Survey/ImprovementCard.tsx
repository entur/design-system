import React from 'react';

import type { ImprovementItem } from './surveyData';

type ImprovementCardProps = {
  item: ImprovementItem;
};

const priorityClass = {
  Høy: 'improvement-card__badge--high',
  Medium: 'improvement-card__badge--medium',
  Lavere: 'improvement-card__badge--low',
};

const ImprovementCard: React.FC<ImprovementCardProps> = ({ item }) => {
  return (
    <div className="improvement-card">
      <div className="improvement-card__header">
        <span className="improvement-card__number">{item.number}</span>
        <h4 className="improvement-card__title">{item.title}</h4>
        <span
          className={`improvement-card__badge ${priorityClass[item.priority]}`}
        >
          {item.priority}
        </span>
      </div>
      <p className="improvement-card__description">{item.description}</p>
      {item.actions.length > 0 && (
        <div className="improvement-card__actions">
          {item.actions.map((action, i) => (
            <span className="improvement-card__action-item" key={i}>
              {action}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImprovementCard;
