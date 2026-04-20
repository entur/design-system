import React from 'react';

import type { FeedbackIssue, FeedbackQuote } from './surveyData';

type FeedbackQuotesProps = {
  title: string;
  quotes: FeedbackQuote[];
};

export const FeedbackQuotes: React.FC<FeedbackQuotesProps> = ({
  title,
  quotes,
}) => {
  return (
    <div className="feedback-list">
      <h3 className="feedback-list__title">{title}</h3>
      <div className="feedback-list__quotes">
        {quotes.map((q, i) => (
          <div className="feedback-list__quote" key={i}>
            <p className="feedback-list__quote-text">{q.text}</p>
            <span className="feedback-list__quote-source">{q.source}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

type FeedbackIssuesProps = {
  title: string;
  issues: FeedbackIssue[];
};

export const FeedbackIssues: React.FC<FeedbackIssuesProps> = ({
  title,
  issues,
}) => {
  return (
    <div className="feedback-list">
      <h3 className="feedback-list__title">{title}</h3>
      <div className="feedback-list__issues">
        {issues.map((issue, i) => (
          <div className="feedback-list__issue" key={i}>
            <span className="feedback-list__issue-count">{issue.count}</span>
            <span className="feedback-list__issue-content">
              <span className="feedback-list__issue-title">
                {issue.title}
              </span>
              <span className="feedback-list__issue-description">
                {issue.description}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
