import React, { cloneElement } from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import classNames from 'classnames';
import './Popover.scss';

type PopoverProps = {
  /** Innholdet i Popover'en */
  children: React.ReactNode;
  /** Komponenten som skal brukes for å åpne Popoveren */
  button: React.ReactElement;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const Popover: React.FC<PopoverProps> = ({
  children,
  className,
  button,
  ...rest
}) => {
  const [showPopover, setShowPopover] = React.useState(true);
  const childProps = {
    onClick: () => setShowPopover(!showPopover),
  };
  return (
    <Manager>
      <Reference>
        {({ ref }) =>
          cloneElement(button, {
            ref: ref,
            ...childProps,
          })
        }
      </Reference>
      {showPopover && (
        <Popper
          placement="bottom"
          modifiers={[
            {
              name: 'arrow',
              options: {
                enabled: true,
              },
            },
            {
              name: 'offset',
              options: {
                offset: [0, 10],
              },
            },
          ]}
        >
          {({ style, placement, ref }) => {
            return (
              <div
                className={classNames(
                  className,
                  'eds-popover',
                  `eds-popover--${placement}`,
                )}
                ref={ref}
                style={style}
                data-placement={placement}
                onBlur={() => setShowPopover(false)}
                {...rest}
              >
                {children}
              </div>
            );
          }}
        </Popper>
      )}
    </Manager>
  );
};
