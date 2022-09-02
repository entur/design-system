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
  /** Om stepperen skal være et interaktivt-navigasjonselement eller ikke
   * @default false
   */
  interactive?: boolean;
  /** Om stepper skal vise indeksering av hvilket trinn man er på
   * @default true
   */
  showStepperIndex?: boolean;
  as?: 'button' | React.ElementType;
  [key: string]: any;
};

export const Stepper: React.FC<StepperProps> = ({
  className,
  onStepClick,
  steps,
  activeIndex,
  interactive = false,
  showStepperIndex = true,
  ...rest
}) => {
  const Element = interactive ? 'button' : 'div';
  return (
    <div className={classNames('eds-stepper', className)} {...rest}>
      {steps.map((step, i) => {
        const isActive = i === activeIndex;
        const hasBeenActive = activeIndex > i;
        const props = interactive ? { onClick: () => onStepClick(i) } : {};
        return (
          <Element
            key={step}
            className={classNames('eds-stepper__item__container', {
              'eds-stepper__item__container--non-interactive': !interactive,
            })}
            aria-current={isActive ? 'step' : undefined}
            aria-label={`Steg ${i + 1} av ${steps.length}, ${step} ${
              hasBeenActive ? ', fullført' : ''
            }`}
            {...props}
          >
            <div
              className={classNames(
                'eds-stepper__item__square',
                { 'eds-stepper__item__square--active': isActive },
                { 'eds-stepper__item__square--inactive': activeIndex < i },
                { 'eds-stepper__item__square--has-been': hasBeenActive },
              )}
            />
            <Label
              className={classNames(
                'eds-stepper__item__label',
                {
                  'eds-stepper__item__label--has-been': hasBeenActive,
                },
                {
                  'eds-stepper__item__label--active': isActive,
                },
              )}
            >
              {showStepperIndex && i + 1 + '. ' + step}
            </Label>
          </Element>
        );
      })}
    </div>
  );
};
