import React, { useState } from 'react';
import { DataCell } from './DataCell';
import classNames from 'classnames';
import './EditableCell.scss';

type EditableCellProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** En callback som blir kalles hver gang innholdet endres  */
  onChange?: (e: React.ChangeEvent) => void;
  /** Verdien til cellen */
  value: string;
  [key: string]: any;
};

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onChange,
  className,
  name,
  ...rest
}) => {
  const [editing, setEditing] = useState(rest.open ? true : false);

  return (
    <DataCell className={classNames('eds-editable-cell', className)} {...rest}>
      {editing ? (
        <input
          type="text"
          className="eds-editable-cell__cell eds-editable-cell__input"
          value={value}
          autoFocus
          onBlur={() => setEditing(false)}
          onChange={onChange}
          name={name}
        />
      ) : (
        <button
          className="eds-editable-cell__cell eds-editable-cell__activate-button"
          onClick={() => setEditing(true)}
          onFocus={() => setEditing(true)}
        >
          {value}
        </button>
      )}
    </DataCell>
  );
};
