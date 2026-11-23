import { useId } from 'react';
import classNames from 'classnames';

import { VariantType } from '@entur/utils';

import { useVariant } from './VariantProvider';

type UseFeedbackDescriptionOptions = {
  /** Feedback-teksten som vises under skjemafeltet */
  feedback?: React.ReactNode;
  /** Valideringsvarianten til skjemafeltet */
  variant?: VariantType | 'error' | 'info';
  /** Props til feedback-teksten. En `id` her brukes som id-en til teksten */
  feedbackProps?: React.HTMLAttributes<HTMLElement>;
  /** aria-describedby som sendes inn til skjemafeltet, og som skal beholdes */
  'aria-describedby'?: string;
};

/** Regelen BaseFormControl bruker for å vise feedback-teksten */
export const isFeedbackShown = (
  feedback: React.ReactNode,
  variant?: string | null,
) => Boolean(feedback && variant);

/** Internal: only for @entur/* packages, no semver guarantee.
 *
 * Kobler feedback-teksten til skjemafeltet. Send `feedbackId` til
 * BaseFormControl og `aria-describedby` til skjemafeltet */
export const useFeedbackDescription = ({
  feedback,
  variant,
  feedbackProps,
  'aria-describedby': ariaDescribedBy,
}: UseFeedbackDescriptionOptions) => {
  const generatedId = `eds-feedback${useId()}`;
  const contextVariant = useVariant();
  const feedbackId = feedbackProps?.id ?? generatedId;
  const showFeedback = isFeedbackShown(feedback, variant || contextVariant);
  return {
    feedbackId,
    'aria-describedby':
      classNames(ariaDescribedBy, showFeedback && feedbackId) || undefined,
  };
};
