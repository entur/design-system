import React from 'react';
import classNames from 'classnames';
import './FloatingButton.scss';

export type FloatingButtonProps = {
  /** Beskrivende tekst for skjermlesere */
  'aria-label': string;
  /** Ikon eller ikon-og-tekst */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Callback når knappen klikkes */
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  [key: string]: any;
};

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  className,
  children,
  ...rest
}) => {
  return (
    <button
      className={classNames(
        'eds-floating-button',
        { 'eds-floating-button--extended': React.Children.count(children) > 1 },
        className,
      )}
      type="button"
      {...rest}
    >
      {wrapStringsInSpans(children)}
    </button>
  );
};

const wrapStringsInSpans = (children: React.ReactNode) =>
  React.Children.map(children, child =>
    typeof child === 'string' ? <span>{child}</span> : child,
  );
