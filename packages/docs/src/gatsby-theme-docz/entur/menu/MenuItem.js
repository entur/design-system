import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { ActiveContext } from '.';

import { itemClassName } from './styles.scss';

const propTypes = {
  id: PropTypes.string.isRequired,
  active: PropTypes.bool,
  label: PropTypes.node.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  refCallback: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium']),
};

const innerClass = `${itemClassName}__inner`;

function getClassNames({ active, disabled, nested, size }) {
  return cx(itemClassName, {
    [`${itemClassName}--active`]: active,
    [`${itemClassName}--disabled`]: disabled,
    [`${itemClassName}--nested`]: nested,
    [`${itemClassName}--size-${size}`]: size,
  });
}

function isActive(activeId, child) {
  if (child.props.id === activeId) return true;
  if (!child.props.children) return false;

  return React.Children.toArray(child.props.children).some(grandChild =>
    isActive(activeId, grandChild),
  );
}

export function MenuItem(props) {
  const {
    id,
    children,
    disabled,
    label,
    icon,
    onClick,
    refCallback,
    size = 'medium',
    ...rest
  } = props;

  const activeId = useContext(ActiveContext);
  const active = isActive(activeId, { props });

  const labelComponent =
    typeof label === 'string' ? (
      <button disabled={disabled} onClick={onClick}>
        {icon}
        {label}
      </button>
    ) : (
      label
    );

  const classNames = getClassNames({
    active,
    disabled,
    nested: Boolean(children),
    size,
  });

  return (
    <li {...rest} ref={refCallback} className={classNames}>
      <div className={innerClass}>{labelComponent}</div>
      {children && active ? children : null}
    </li>
  );
}

MenuItem.propTypes = propTypes;
