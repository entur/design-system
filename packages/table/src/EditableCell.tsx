import classNames from 'classnames';
import React from 'react';
import { DataCell } from './DataCell';
import { VariantProvider, FeedbackText } from '@entur/form';
import './EditableCell.scss';

type EditableCellProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** En callback som blir kalles hver gang innholdet endres  */
  onChange?: (e: React.ChangeEvent) => void;
  children: React.ReactElement;
  [key: string]: any;
};

export const EditableCell: React.FC<EditableCellProps> = ({
  children,
  className,
  name,
  feedback,
  variant,

  ...rest
}) => {
  return (
    <DataCell className={classNames('eds-editable-cell', className)} {...rest}>
      <VariantProvider variant={variant}>
        {children}
        {feedback && variant && (
          <FeedbackText variant={variant}>{feedback}</FeedbackText>
        )}
      </VariantProvider>
    </DataCell>
  );
};
