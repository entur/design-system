import React, { useCallback, useEffect, useRef, useState } from 'react';
import { mergeRefs } from '@entur/utils';

import './BaseExpand.scss';

type BaseExpandProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  /** Innholdet som skal være expandable */
  children: React.ReactNode;
  /** Boolean for om innholdet vises eller ikke */
  open: boolean;
  /** Avmonter innholdet når det lukkes. Når false (standard), holdes innholdet montert og skjules med CSS.
   * @default false
   */
  unmountOnClose?: boolean;
};

export const BaseExpand = React.forwardRef<HTMLDivElement, BaseExpandProps>(
  ({ open, children, unmountOnClose = false, ...rest }, ref) => {
    const [mounted, setMounted] = useState(open || !unmountOnClose);
    const [expanded, setExpanded] = useState(open);
    const collapseRef = useRef<HTMLDivElement>(null);

    // Opening: mount first, then expand in next frame to trigger CSS transition.
    // Closing: collapse immediately — unmount happens on transitionend.
    useEffect(() => {
      if (open) {
        setMounted(true);
      } else {
        setExpanded(false);
      }
    }, [open]);

    // After the component mounts at 0fr, trigger the expand in the next frame
    // so the browser paints the collapsed state before transitioning to 1fr.
    useEffect(() => {
      if (mounted && open && !expanded) {
        const raf = requestAnimationFrame(() => {
          setExpanded(true);
        });
        return () => cancelAnimationFrame(raf);
      }
    }, [mounted, open, expanded]);

    const handleTransitionEnd = useCallback(
      (e: React.TransitionEvent) => {
        if (e.target === collapseRef.current && !open && unmountOnClose) {
          setMounted(false);
        }
      },
      [open, unmountOnClose],
    );

    // Fallback for when CSS transitions are disabled (e.g. disableAnimation prop).
    // In that case transitionend never fires, so we unmount based on computed style.
    useEffect(() => {
      if (!open && mounted && !expanded && unmountOnClose) {
        const el = collapseRef.current;
        if (!el) return;
        const duration =
          parseFloat(getComputedStyle(el).transitionDuration) || 0;
        if (duration === 0) {
          setMounted(false);
        }
      }
    }, [open, mounted, expanded, unmountOnClose]);

    if (!mounted) return null;

    return (
      <div
        ref={mergeRefs(collapseRef, ref)}
        className={`eds-base-expand${expanded ? ' eds-base-expand--open' : ''}`}
        onTransitionEnd={handleTransitionEnd}
        {...(!expanded ? { 'aria-hidden': true, inert: '' } : {})}
      >
        <div className="eds-base-expand__inner">
          <div {...rest}>{children}</div>
        </div>
      </div>
    );
  },
);
