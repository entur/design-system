import React from 'react';
import './PagePlaceholder.scss';

const navWidths = ['70%', '55%', '80%', '60%', '75%', '50%', '65%', '45%'];
const paragraphs = [
  ['100%', '97%', '100%', '92%', '58%'],
  ['100%', '95%', '99%', '41%'],
  null,
  ['100%', '98%', '100%', '96%', '72%'],
  ['100%', '64%'],
];

/** Stand-in page content (sidebar and text) for page-level examples such as Footer */
export const PagePlaceholder: React.FC = () => (
  <div className="page-placeholder" aria-hidden="true">
    <div className="page-placeholder__sidebar">
      {navWidths.map((width, i) => (
        <span
          key={i}
          className="page-placeholder__nav-item"
          style={{ width }}
        />
      ))}
    </div>
    <div className="page-placeholder__main">
      <span className="page-placeholder__heading" />
      {paragraphs.map((lines, i) =>
        lines ? (
          <div key={i} className="page-placeholder__paragraph">
            {lines.map((width, j) => (
              <span
                key={j}
                className="page-placeholder__line"
                style={{ width }}
              />
            ))}
          </div>
        ) : (
          <span key={i} className="page-placeholder__subheading" />
        ),
      )}
      <div className="page-placeholder__actions">
        <span className="page-placeholder__button" />
        <span className="page-placeholder__button page-placeholder__button--secondary" />
      </div>
    </div>
  </div>
);
