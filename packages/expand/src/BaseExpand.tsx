import React, { useState, useEffect, useRef, useCallback } from 'react';

import './BaseExpand.scss';

type BaseExpandProps = {
  /** Innholdet som skal være expandable */
  children: React.ReactNode;
  /** Boolean for om innholdet vises eller ikke */
  open: boolean;
  [key: string]: any;
};

export const BaseExpand: React.FC<BaseExpandProps> = ({
  open,
  children,
  ...rest
}) => {
  const [mounted, setMounted] = useState(open);
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
      if (e.target === collapseRef.current && !open) {
        setMounted(false);
      }
    },
    [open],
  );

  // Fallback for when CSS transitions are disabled (e.g. disableAnimation prop).
  // In that case transitionend never fires, so we unmount based on computed style.
  useEffect(() => {
    if (!open && mounted && !expanded) {
      const el = collapseRef.current;
      if (!el) return;
      const duration = parseFloat(getComputedStyle(el).transitionDuration) || 0;
      if (duration === 0) {
        setMounted(false);
      }
    }
  }, [open, mounted, expanded]);

  if (!mounted) return null;

  return (
    <div
      ref={collapseRef}
      className={`eds-base-expand${expanded ? ' eds-base-expand--open' : ''}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="eds-base-expand__inner">
        <div {...rest}>{children}</div>
      </div>
    </div>
  );
};
