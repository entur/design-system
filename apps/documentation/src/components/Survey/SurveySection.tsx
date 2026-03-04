import React from 'react';

type SurveySectionProps = {
  number?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const SurveySection: React.FC<SurveySectionProps> = ({
  number,
  title,
  subtitle,
  children,
  className,
  id,
}) => {
  return (
    <section id={id} className={`survey-section ${className ?? ''}`}>
      <div className="survey-section__header">
        <h2 className="survey-section__title">
          {number && `${number}. `}
          {title}
        </h2>
      </div>
      {subtitle && <p className="survey-section__subtitle">{subtitle}</p>}
      <div className="survey-section__content">{children}</div>
    </section>
  );
};

export default SurveySection;
