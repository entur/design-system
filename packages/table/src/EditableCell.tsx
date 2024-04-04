import classNames from 'classnames';
import React from 'react';
import { DataCell } from './DataCell';

import { VariantProvider } from '@entur/form';
import { VariantType } from '@entur/utils';
import { Tooltip } from '@entur/tooltip';

import './EditableCell.scss';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const error = 'error';

type EditableCellProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Inputelementet som skal være i tabellcellen */
  children: React.ReactElement;
  /** Valideringsvariant for EditableCell, info og error er deprecated bruk information og negative istedenfor */
  variant?: VariantType | typeof error | typeof info;
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
  return (
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
        <Tooltip
          disableHoverListener={!feedback}
          disableFocusListener={!feedback}
          placement="bottom"
          content={feedback || undefined}
          variant={feedback ? 'negative' : undefined}
        >
          {children}
        </Tooltip>
      </DataCell>
    </VariantProvider>
  );
};
