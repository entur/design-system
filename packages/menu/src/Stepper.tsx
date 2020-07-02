import React from 'react';
import classNames from 'classnames';
import { Label } from '@entur/typography';

import './Stepper.scss';

export type StepperProps = {
  /** Det nåværende steget. */
  activeIndex: number;
  /** Oppdater state ved klikk. */
  onStepClick: (index: number) => void;
  /** Liste av steg. */
  steps: string[];
  /** Ekstra klassenavn. */
  className?: string;
  [key: string]: any;
};

export const Stepper: React.FC<StepperProps> = ({
  className,
  onStepClick,
  steps,
  activeIndex,
  ...rest
}) => {
  return (
    <div className={classNames('eds-stepper', className)} {...rest}>
      {steps.map((step, i) => {
        const isActive = i === activeIndex;
        const hasBeenActive = activeIndex > i;
        return (
          <button
            key={step}
            onClick={() => onStepClick(i)}
            className="eds-stepper__item__container"
          >
            <div
              className={classNames(
                'eds-stepper__item__square',
                { 'eds-stepper__item__square--active': isActive },
                { 'eds-stepper__item__square--inactive': activeIndex < i },
                { 'eds-stepper__item__square--has-been': hasBeenActive },
              )}
            ></div>
            <Label
              className={classNames('eds-stepper__item__label', {
                'eds-stepper__item__label--active': hasBeenActive,
              })}
            >
              {i + 1}. {step}
            </Label>
          </button>
        );
      })}
    </div>
  );
};
