import React from 'react';
import classNames from 'classnames';

import { VisuallyHidden } from '@entur/a11y';

import './Stepper.scss';

export type StepperProps = {
  /** Liste med steg-navn i rekkefølge. */
  steps: string[];
  /** Det nåværende steget. 0-indeksert */
  activeIndex: number;
  /** Om stepperen skal være et interaktivt-navigasjonselement eller ikke
   * @default false
   */
  interactive?: boolean;
  /** Kalles med indeksen til det klikkede steget.
   * Fungerer kun hvis Stepper-en er interaktiv */
  onStepClick?: (index: number) => void;
  /** Om stepper skal vise indeksering av hvilket trinn man er på
   * @default true
   */
  showStepperIndex?: boolean;
  /** Ekstra klassenavn. */
  className?: string;
  /** Skjermlesertekst for ordet 'steg' som i '_steg_ 1 av 3'
   * @default 'Steg'
   */
  ariaLabelStep?: string;
  /** Skjermlesertekst for ordet 'av' som i 'steg 1 _av_ 3'
   * @defaul 'av'
   */
  ariaLabelOf?: string;
  /** Skjermlesertekst for ordet fullført
   * @default 'fullført'
   */
  ariaLabelCompleted?: string;
  /** Skjermlesertekst for oppsummering av hele stepper-en
   * @default `Stegindikator med ${steps.length} steg, du er på steg ${activeIndex + 1} ${steps[activeIndex]},`
   */
  ariaLabelSummary?: string;
  [key: string]: any;
};

export const Stepper: React.FC<StepperProps> = ({
  activeIndex,
  className,
  interactive = false,
  onStepClick,
  showStepperIndex = true,
  steps,
  ariaLabelStep = 'Steg',
  ariaLabelOf = 'av',
  ariaLabelCompleted = 'fullført',
  ariaLabelSummary = `Stegindikator med ${steps.length} steg, du er på steg ${
    activeIndex + 1
  } ${steps[activeIndex]},`,
  ...rest
}) => {
  return (
    <ol
      className={classNames('eds-stepper', className)}
      aria-label={ariaLabelSummary}
      {...rest}
    >
      {steps.map((step, i) => {
        const isCurrent = i === activeIndex;
        const isInteractive = interactive && activeIndex > i;
        const Element = isInteractive ? 'button' : 'div';
        const isCompleted = activeIndex > i;
        const currentStepSummary = `${ariaLabelStep} ${i + 1} ${ariaLabelOf} ${
          steps.length
        }, ${step} ${isCompleted ? `, ${ariaLabelCompleted}` : ''}`;
        const props = isInteractive ? { onClick: () => onStepClick?.(i) } : {};

        return (
          <li key={step} className="eds-stepper__step__wrapper">
            <Element
              className={classNames(
                'eds-stepper__step',
                { 'eds-stepper__step--active': isCurrent },
                { 'eds-stepper__step--completed': isCompleted },
                { 'eds-stepper__step--interactive': isInteractive },
              )}
              aria-current={isCurrent ? 'step' : undefined}
              {...props}
            >
              <div className="eds-stepper__step__line" aria-hidden={true} />
              <span className="eds-stepper__step__label" aria-hidden={true}>
                {showStepperIndex && i + 1 + '.'} {step}
              </span>
              <VisuallyHidden>{currentStepSummary}</VisuallyHidden>
            </Element>
          </li>
        );
      })}
    </ol>
  );
};
