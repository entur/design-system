import React, { createContext } from 'react';
import PropTypes from 'prop-types';

import { rootClassName, listClassName } from './styles.scss';

export const ActiveContext = createContext();

function cloneChildren(children, getPropsUpdates) {
  return React.Children.toArray(children).map(child => {
    return React.cloneElement(child, getPropsUpdates(child));
  });
}

export function Menu({
  active,
  onItemSelected,
  children,
  refCallback,
  size,
  ...rest
}) {
  const menuItems = onItemSelected
    ? cloneChildren(children, child => ({
        size,
        onClick: () => onItemSelected(child.props.id),
      }))
    : children;

  return (
    <div {...rest} ref={refCallback} className={rootClassName}>
      <ul className={listClassName}>
        {active ? (
          <ActiveContext.Provider value={active}>
            {menuItems}
          </ActiveContext.Provider>
        ) : (
          menuItems
        )}
      </ul>
    </div>
  );
}

Menu.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.string,
  onItemSelected: PropTypes.func,
  refCallback: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium']),
};
