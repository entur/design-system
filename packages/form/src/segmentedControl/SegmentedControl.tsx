import React, { useId } from 'react';
import classNames from 'classnames';
import { Label } from '@entur/typography';
import { ExtendableProps } from '@entur/utils';
import './SegmentedControl.scss';

type SegmentedContextProps = {
  name: string;
  onChange: (value: string | null) => void;
  value: string | null;
  size: 'medium' | 'large';
  focusedValue: string | null;
  setFocusedValue: (value: string | null) => void;
};

const SegmentedContext = React.createContext<SegmentedContextProps | null>(
  null,
);

export const useSegmentedContext = (): SegmentedContextProps => {
  const context = React.useContext(SegmentedContext);
  if (!context) {
    throw new Error(
      'You need to wrap your SegmentedChoice in SegmentedControl',
    );
  }
  return context;
};

export type SegmentedControlProps = ExtendableProps<
  React.HTMLAttributes<HTMLDivElement>,
  {
    /** Navn på input-elementene */
    name?: string;
    /** Beskrivende tekst */
    label?: string;
    /** En eller flere SegmentedChoice-komponenter */
    children: React.ReactNode;
    /**
     * Den valgte verdien (kontrollert modus).
     * Bruk `value` for kontrollert eller evt. `defaultValue` for ukontrollert komponent.
     */
    value?: string | null;
    /**
     * Standard verdi (ukontrollert modus).
     * Brukes når komponenten skal håndtere sin egen tilstand.
     */
    defaultValue?: string | null;
    /**
     * Callback for når det gjøres et valg.
     * Påkrevd for kontrollert modus (`value` eller `selectedValue`).
     */
    onChange?: (value: string | null) => void;
    /** Størrelsen på SegmentedChoice-komponentene */
    size?: 'medium' | 'large';
    /** Ekstra klassenavn */
    className?: string;
    /** @deprecated Bruk `value` for kontrollert eller `defaultValue` for ukontrollert oppførsel i stedet.
     *
     * Vi beveger oss gradvis mot å standardisere props for å følge
     * HTML-standarder. Derfor vil vi etter hvert avvikle `selectedValue` og lignende props over tid. */
    selectedValue?: string | null;
  }
>;

export const SegmentedControl = React.forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(
  (
    {
      children,
      label,
      name,
      onChange,
      value,
      defaultValue,
      size = 'medium',
      className,
      selectedValue: deprecatedValue,
      ...rest
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState<string | null>(
      defaultValue ?? null,
    );
    const [focusedValue, setFocusedValue] = React.useState<string | null>(null);
    const id = `eds-segmented-control${useId()}`;

    const isControlled = deprecatedValue !== undefined || value !== undefined;
    const currentValue =
      deprecatedValue !== undefined
        ? deprecatedValue
        : value !== undefined
        ? value
        : internalValue;

    const handleChange = React.useCallback(
      (newValue: string | null) => {
        if (!isControlled) {
          setInternalValue(newValue);
        }

        onChange?.(newValue);
      },
      [isControlled, onChange],
    );

    const contextValue = React.useMemo(
      () => ({
        name: name ?? label ?? id,
        onChange: handleChange,
        value: currentValue,
        size,
        focusedValue,
        setFocusedValue,
      }),
      [id, name, handleChange, currentValue, size, focusedValue, label],
    );

    const labelId = `${id}-label`;

    return (
      <SegmentedContext.Provider value={contextValue}>
        <div
          className={classNames('eds-segmented-control', className)}
          role="radiogroup"
          aria-labelledby={label ? labelId : undefined}
          ref={ref}
          {...rest}
        >
          {label !== undefined && (
            <Label htmlFor={id} id={labelId}>
              {label}
            </Label>
          )}
          <input
            name={name ?? label ?? id}
            value={currentValue ?? undefined}
            type="hidden"
            id={id}
          />
          <div className="eds-segmented-control__choices">
            {React.Children.map(children, (child, index) => {
              if (index === 0 && React.isValidElement(child))
                return React.cloneElement(child, {
                  'data-first-child': true,
                } as any);

              return child;
            })}
          </div>
        </div>
      </SegmentedContext.Provider>
    );
  },
);
