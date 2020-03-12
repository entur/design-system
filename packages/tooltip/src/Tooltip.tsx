import React, { cloneElement } from 'react';
import { useTooltip, TooltipPopup } from '@reach/tooltip';

import classNames from 'classnames';

export type TooltipProps = {
  /** Plassering av tooltip-en */
  placement:
    | 'top-left'
    | 'top'
    | 'top-right'
    | 'left'
    | 'right'
    | 'bottom-left'
    | 'bottom'
    | 'bottom-right';
  /** Innholdet i tooltip-boksen */
  content: string;
  /** Elementet som skal ha tooltip-funksjonalitet */
  children: React.ReactElement;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};
export const Tooltip: React.FC<TooltipProps> = ({
  placement,
  content,
  children,
  className,
  ...rest
}) => {
  // get the props from useTooltip
  const [trigger, tooltip] = useTooltip();
  // destructure off what we need to position the triangle
  // const { isVisible, triggerRect } = tooltip;

  // const [showTooltip, setShowTooltip] = useState(false);
  return (
    <>
      {cloneElement(children, trigger)}
      <div
        className="eds-tooltip-wrapper"
        // onMouseLeave={() => setShowTooltip(false)}
      >
        <TooltipPopup
          className={classNames(
            'eds-tooltip',
            className,
            `eds-tooltip--${placement}`,
          )}
          role="tooltip"
          // aria-hidden={!showTooltip}
          {...tooltip}
          label={content}
          // position={placement}
          {...rest}
        ></TooltipPopup>
      </div>
    </>
  );
};
