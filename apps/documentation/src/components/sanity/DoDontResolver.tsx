import React from 'react';
import { DoDontGroup, DoDontCard } from '@components/Cards/DoDont';

type DoDontCardType = {
  variant: 'success' | 'information' | 'warning' | 'negative' | 'none';
  title?: string;
  content?: string;
  image?: {
    asset?: {
      url?: string;
    };
  };
  alt?: string;
  noPadding?: boolean;
  textInBox?: boolean;
};

type DoDontGroupType = {
  title?: string;
  cards: DoDontCardType[];
};

type Props = {
  value: DoDontGroupType;
};

export const DoDontResolver = ({ value }: Props) => {
  const { title, cards } = value;

  return (
    <div style={{ margin: '2rem 0' }}>
      {title && <h3>{title}</h3>}
      <DoDontGroup>
        {cards.map((card, index) => {
          // Get image URL from Sanity asset
          const imageUrl = card.image?.asset?.url;

          return (
            <DoDontCard
              key={index}
              variant={card.variant}
              title={card.title}
              src={imageUrl}
              alt={card.alt || ''}
              noPadding={card.noPadding || false}
              textInBox={card.textInBox || false}
            >
              {card.content}
            </DoDontCard>
          );
        })}
      </DoDontGroup>
    </div>
  );
};
