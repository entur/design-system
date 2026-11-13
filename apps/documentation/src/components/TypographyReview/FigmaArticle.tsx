import React from 'react';
import { withPrefix } from 'gatsby';
import {
  Heading,
  Link,
  ListItem,
  Text,
  TextContainer,
  UnorderedList,
} from '@entur/typography/beta';

import { FigmaLayer, figmaArticle } from './figmaArticleData';
import { Gaps, SettingsContext, Stage } from './helpers';

const headingElement = {
  'title-1': 'h1',
  'title-2': 'h2',
  'subtitle-1': 'h3',
  'subtitle-2': 'h4',
} as const;

// The same text as the Figma layers, one component per paragraph or list
const renderLayer = (layer: FigmaLayer, index: number) => {
  const [first] = layer.parts[0].lines;
  if (layer.type === 'leading' || layer.type === 'paragraph') {
    return layer.parts.map((part, partIndex) =>
      part.list ? (
        <UnorderedList key={`${index}-${partIndex}`}>
          {part.lines.map(line => (
            <ListItem key={line}>{line}</ListItem>
          ))}
        </UnorderedList>
      ) : (
        part.lines.map(line => (
          <Text
            key={line}
            variant={layer.type === 'leading' ? 'leading' : undefined}
          >
            {line}
          </Text>
        ))
      ),
    );
  }
  return (
    <Heading key={index} as={headingElement[layer.type]} variant={layer.type}>
      {first}
    </Heading>
  );
};

/** The Figma export, with the space after each layer drawn on top */
const FigmaImage = () => {
  const { gaps } = React.useContext(SettingsContext);
  return (
    <div className="typography-review__gaps-wrap">
      <img
        className="typography-review__figma-image"
        src={withPrefix('/typografi-gjennomgang/figma-artikkel@2x.png')}
        width={figmaArticle.width}
        height={figmaArticle.height}
        alt="Artikkelen «For leverandører» slik den ser ut i Figma"
      />
      {gaps && (
        <div className="typography-review__gaps" aria-hidden="true">
          {figmaArticle.layers.map(layer => {
            const gap = layer.height - layer.textHeight;
            return (
              gap > 0 && (
                <div
                  key={layer.y}
                  className="typography-review__gap"
                  style={{ top: layer.y + layer.textHeight, height: gap }}
                >
                  <span>{gap}</span>
                </div>
              )
            );
          })}
        </div>
      )}
    </div>
  );
};

/** Figma and code side by side, at the same width, so every gap can be compared */
export const FigmaArticle = () => (
  <>
    <Text variant="subparagraph" spacing={{ bottom: 'lg' }}>
      Samme tekst som <Link href={figmaArticle.url}>artikkelen i Figma</Link>, i
      600 px bredde. Figma har avsnitt og punkter i samme tekstlag med 16 px
      mellom, så «Vis avstander» viser bare luften mellom lagene der.
    </Text>
    <div className="typography-review__figma-compare">
      <Stage label="Figma">
        <FigmaImage />
      </Stage>
      <Stage label="Kode">
        <div className="typography-review__figma-frame">
          <Gaps as={TextContainer}>{figmaArticle.layers.map(renderLayer)}</Gaps>
        </div>
      </Stage>
    </div>
  </>
);
