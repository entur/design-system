import React, { useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Switch } from '@entur/form';
import { ImageIcon } from '@entur/icons';
import { Text } from '@entur/typography/beta';

export type ColorMode = 'standard' | 'contrast' | 'dark';
export type Density = 'standard' | 'compact' | 'display';

export type Settings = {
  mode: ColorMode;
  density: Density;
  gaps: boolean;
};

export const SettingsContext = React.createContext<Settings>({
  mode: 'standard',
  density: 'standard',
  gaps: false,
});

/** One example, in the colour mode and density from the toolbar */
export const Stage = ({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) => {
  const { mode, density } = React.useContext(SettingsContext);
  return (
    <div>
      {label && (
        <Text variant="overline" spacing={{ bottom: 'xs' }}>
          {label}
        </Text>
      )}
      <div
        className={classNames(
          'typography-review__stage',
          `typography-review__stage--${mode}`,
          { 'eds-contrast': mode === 'contrast' },
        )}
        data-color-mode={mode === 'dark' ? 'dark' : 'light'}
        data-view-mode={density}
      >
        {children}
      </div>
    </div>
  );
};

/** Today's typography next to the new one */
export const Compare = ({
  today,
  now,
}: {
  today?: React.ReactNode;
  now: React.ReactNode;
}) => (
  <div
    className={classNames('typography-review__compare', {
      'typography-review__compare--single': today === undefined,
    })}
  >
    {today !== undefined && <Stage label="I dag">{today}</Stage>}
    <Stage label="Ny">{now}</Stage>
  </div>
);

type Gap = { top: number; height: number; label: string };

/** Stands in for an image in the examples */
export const ImagePlaceholder = () => (
  <div className="typography-review__image" role="img" aria-label="Bilde">
    <ImageIcon aria-hidden />
  </div>
);

/** A switch that draws the gaps in the examples below it */
export const WithGaps = ({ children }: { children: React.ReactNode }) => {
  const settings = React.useContext(SettingsContext);
  const [gaps, setGaps] = useState(false);
  return (
    <>
      <Switch
        checked={gaps}
        onChange={e => setGaps(e.target.checked)}
        className="typography-review__example-switch"
      >
        Vis avstander
      </Switch>
      <SettingsContext.Provider value={{ ...settings, gaps }}>
        {children}
      </SettingsContext.Provider>
    </>
  );
};

/** A block of text whose gaps can be drawn on top of it */
export const Gaps = ({
  as: Container = 'div',
  children,
}: {
  as?: React.ElementType;
  children: React.ReactNode;
}) => {
  const { gaps: show, density, mode } = React.useContext(SettingsContext);
  const ref = useRef<HTMLElement>(null);
  const [gaps, setGaps] = useState<Gap[]>([]);

  useLayoutEffect(() => {
    const container = ref.current;
    if (!show || !container) {
      setGaps([]);
      return;
    }
    const measure = () => {
      const base = container.getBoundingClientRect().top;
      const children = Array.from(container.children);
      const next: Gap[] = [];
      children.forEach((child, index) => {
        const previous = children[index - 1];
        const bottom = previous
          ? previous.getBoundingClientRect().bottom
          : base;
        const gap = child.getBoundingClientRect().top - bottom;
        if (gap < 1) return;
        next.push({
          top: bottom - base,
          height: gap,
          label: `${Math.round(gap)}`,
        });
      });
      // Space after the last child, inside the container
      const last = children[children.length - 1];
      if (last) {
        const end = container.getBoundingClientRect().bottom;
        const after = end - last.getBoundingClientRect().bottom;
        if (after >= 1)
          next.push({
            top: last.getBoundingClientRect().bottom - base,
            height: after,
            label: `${Math.round(after)}`,
          });
      }
      setGaps(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [show, density, mode]);

  return (
    <div className="typography-review__gaps-wrap">
      <Container ref={ref} className="typography-review__flow-root">
        {children}
      </Container>
      {show && (
        <div className="typography-review__gaps" aria-hidden="true">
          {gaps.map(gap => (
            <div
              key={`${gap.top}-${gap.height}`}
              className="typography-review__gap"
              style={{ top: gap.top, height: gap.height }}
            >
              <span>{gap.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const px = (value: string) => `${Math.round(parseFloat(value))}`;

/** A sample with its name and the size the browser renders it at */
export const Spec = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { density } = React.useContext(SettingsContext);
  const [values, setValues] = useState('');

  useLayoutEffect(() => {
    const el = ref.current?.firstElementChild;
    if (!el) return;
    const style = getComputedStyle(el);
    setValues(
      `${px(style.fontSize)}/${px(style.lineHeight)} · ${style.fontWeight}`,
    );
  }, [density]);

  return (
    <div className="typography-review__spec">
      <div ref={ref} className="typography-review__spec-sample">
        {children}
      </div>
      <div className="typography-review__spec-meta">
        <span>{name}</span>
        <span>{values}</span>
      </div>
    </div>
  );
};
