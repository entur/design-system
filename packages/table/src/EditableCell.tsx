import classNames from 'classnames';
import React from 'react';
import { DataCell } from './DataCell';
import { VariantProvider, VariantType } from '@entur/form';
import { Tooltip } from '@entur/tooltip';
import './EditableCell.scss';

type EditableCellProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Inputelementet som skal være i tabellcellen */
  children: React.ReactElement;
  /** Valideringsvariant for EditableCell */
  variant?: VariantType;
  /** Varselmelding, som vil komme som en Tooltip under EditableCell */
  feedback?: string;
  /** Om cellen skal vise omriss til enhver tid
   * @default false
   */
  outlined?: boolean;
  [key: string]: any;
};

export const EditableCell: React.FC<EditableCellProps> = ({
  children,
  className,
  feedback,
  variant,
  outlined = false,
  ...rest
}) => {
  return feedback ? (
    <VariantProvider variant={variant}>
      <DataCell
        className={classNames(
          'eds-editable-cell',
          {
            'eds-editable-cell--outlined': outlined,
          },
          className,
        )}
        {...rest}
      >
        <Tooltip placement="bottom" content={feedback} variant="error">
          {children}
        </Tooltip>
      </DataCell>
    </VariantProvider>
  ) : (
    <VariantProvider variant={variant}>
      <DataCell
        className={classNames(
          'eds-editable-cell',
          {
            'eds-editable-cell--outlined': outlined,
          },
          className,
        )}
        {...rest}
      >
        {children}
      </DataCell>
    </VariantProvider>
  );
};
