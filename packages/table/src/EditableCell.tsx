import classNames from 'classnames';
import React from 'react';
import { DataCell } from './DataCell';
import { InputGroup } from '@entur/form';
import './EditableCell.scss';

type EditableCellProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** En callback som blir kalles hver gang innholdet endres  */
  onChange?: (e: React.ChangeEvent) => void;
  /** Verdien til cellen */
  value?: string;
  children: React.ReactElement;
  [key: string]: any;
};

export const EditableCell: React.FC<EditableCellProps> = ({
  children,
  value,
  onChange,
  className,
  name,
  feedback,
  variant,

  ...rest
}) => {
  // const [editing, setEditing] = useState(rest.open ? true : false);
  console.log(variant);

  return (
    <DataCell className={classNames('eds-editable-cell', className)} {...rest}>
      <InputGroup feedback={feedback} variant={variant} label="ok">
        {/* {React.cloneElement(children, {
          className: 'eds-editable-cell__cell eds-editable-cell__input',
          // value: { value },
          // autoFocus: true,
          // onBlur: () => setEditing(false),
          // onChange: { onChange },
          // name: { name },
        })} */}
        {children}
      </InputGroup>
    </DataCell>
  );
};
