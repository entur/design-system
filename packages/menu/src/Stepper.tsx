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
        return (
          <div
            key={step}
            onClick={() => onStepClick(i)}
            className="eds-stepper__item__container"
          >
            <Label
              className={classNames(
                isActive
                  ? 'eds-stepper__item__label--active'
                  : 'eds-stepper__item__label--inactive',
                'eds-stepper__item__label',
              )}
            >
              {i + 1}. {step}
            </Label>
          </div>
        );
      })}
    </div>
  );
};
