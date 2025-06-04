import React from 'react';
import './DetailsList.scss';

// DetailsList is a component that displays a list of items with an icon, label, and description. Now used in workshoptemplate descriptions, under category resources.
type InfoItem = {
  icon: React.ReactNode;
  label: string;
  description: string;
};

type DetailsListProps = {
  items: InfoItem[];
};

export function DetailsList({ items }: DetailsListProps) {
  return (
    <div className="details-list">
      {items.map((item, index) => (
        <div key={index} className="details-list-item">
          <div className="details-list-icon">{item.icon}</div>

          <div className="details-list-label">{item.label}</div>
          <div className="details-list-description">{item.description}</div>
        </div>
      ))}
    </div>
  );
}
