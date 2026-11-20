import React from 'react';
import { ToastAlertBox } from './ToastAlertBox';
import classNames from 'classnames';

type ToastId = string;

/** @deprecated use variant="information" instead */
const info = 'info';

export type ToastVariants = 'success' | 'information' | typeof info;

type ToastType = {
  title?: string;
  content: React.ReactNode;
  id: ToastId;
  variant: ToastVariants;
  isBeingRemoved: boolean;
};

type ToastContextType = {
  addToast: (payload: AddToastPayload | string) => void;
  removeToast: (id: ToastId) => void;
  toasts: ToastType[];
};

export type AddToastPayload = {
  title?: string;
  content: React.ReactNode;
  variant?: ToastVariants;
};

type ToastAction =
  | { type: 'ADD_TOAST'; payload: ToastType }
  | { type: 'REMOVE_TOAST'; payload: ToastId }
  | { type: 'PLAY_EXIT_ANIMATION'; payload: ToastId };

const EXIT_ANIMATION_TIME = 400;

const ToastContext = React.createContext<ToastContextType | null>(null);

const toastReducer = (
  prevToasts: ToastType[],
  action: ToastAction,
): ToastType[] => {
  switch (action.type) {
    case 'ADD_TOAST':
      return [action.payload, ...prevToasts];
    case 'PLAY_EXIT_ANIMATION':
      return prevToasts.map(toast => {
        if (toast.id === action.payload)
          return { ...toast, isBeingRemoved: true };
        return toast;
      });
    case 'REMOVE_TOAST':
      return prevToasts.filter(toast => toast.id !== action.payload);
  }
};

const createUniqueId = () => Math.random().toString().substring(2);

const createToast = (
  toast: AddToastPayload | string,
  id: ToastId,
): ToastType => {
  if (typeof toast === 'string') {
    return { id, content: toast, variant: 'success', isBeingRemoved: false };
  } else {
    return { id, variant: 'success', isBeingRemoved: false, ...toast };
  }
};

export type ToastProviderProps = {
  /** Antall millisekunder før toasts forsvinner av seg selv
   * @default 6000
   */
  delay?: number;
  /** Plasseringen av toasts
   * @default "bottom-right"
   */
  position?: 'bottom-right' | 'top-right';
  /** Ekstra klassenavn til ToastProvider-wrapperen */
  className?: string;
  /** Ekstra styling som sendes til ToastProvider-wrapperen */
  style?: React.CSSProperties;
  /** Innholdet */
  children: React.ReactNode;
};

export const ToastProvider = ({
  delay = 6000,
  children,
  position = 'bottom-right',
  className,
  style,
}: ToastProviderProps) => {
  const [toasts, dispatch] = React.useReducer(toastReducer, []);
  const timeoutIdRefs = React.useRef<{ [key: string]: number }>({});
  const isHovering = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const removeToast = React.useCallback((id: ToastId) => {
    window.clearTimeout(timeoutIdRefs.current[id]);
    dispatch({ type: 'REMOVE_TOAST', payload: id });
    delete timeoutIdRefs.current[id];
  }, []);

  const playExitAnimation = React.useCallback((id: ToastId) => {
    window.clearTimeout(timeoutIdRefs.current[id + 'animation']);
    dispatch({ type: 'PLAY_EXIT_ANIMATION', payload: id });
    delete timeoutIdRefs.current[id + 'animation'];
  }, []);

  const removeToastWithAnimationAfterDelay = React.useCallback(
    (id: ToastId, delay: number) => {
      timeoutIdRefs.current[id + 'animation'] = window.setTimeout(
        () => playExitAnimation(id),
        delay - EXIT_ANIMATION_TIME,
      );
      timeoutIdRefs.current[id] = window.setTimeout(
        () => removeToast(id),
        delay,
      );
    },
    [timeoutIdRefs, playExitAnimation, removeToast],
  );

  const addToast = React.useCallback(
    (toast: AddToastPayload | string) => {
      const id = createUniqueId();
      const payload = createToast(toast, id);
      dispatch({ type: 'ADD_TOAST', payload });
      removeToastWithAnimationAfterDelay(id, delay);
    },
    [delay, removeToastWithAnimationAfterDelay],
  );

  // A toast that is already sliding out keeps its timer, so it is removed on time
  const clearTimers = () => {
    toasts
      .filter(toast => !toast.isBeingRemoved)
      .forEach(toast => {
        for (const key of [toast.id, toast.id + 'animation']) {
          window.clearTimeout(timeoutIdRefs.current[key]);
          delete timeoutIdRefs.current[key];
        }
      });
  };

  const pauseToasts = (toast: ToastType) => {
    if (toast.isBeingRemoved) return;
    clearTimers();
  };

  const resumeToasts = () => {
    clearTimers();
    toasts
      .filter(toast => !toast.isBeingRemoved)
      .forEach(toast => {
        removeToastWithAnimationAfterDelay(toast.id, delay);
      });
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (containerRef.current?.contains(event.relatedTarget)) return;
    if (isHovering.current) return;
    resumeToasts();
  };

  const handleMouseEnter = (toast: ToastType) => {
    isHovering.current = true;
    pauseToasts(toast);
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    if (containerRef.current?.contains(document.activeElement)) return;
    resumeToasts();
  };

  const handleClose = (toastId: ToastId) => () => {
    removeToast(toastId);
    isHovering.current = false;
    resumeToasts();
  };

  const contextValue = React.useMemo(
    () => ({ toasts, addToast, removeToast }),
    [addToast, removeToast, toasts],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {toasts.length > 0 && (
        <div
          className={classNames(
            'eds-toast-container',
            `eds-toast-container--${position}`,
            className,
          )}
          style={style}
          ref={containerRef}
        >
          {toasts.slice(0, 3).map(toastToShow => (
            <ToastAlertBox
              variant={toastToShow.variant}
              title={toastToShow.title}
              onClose={handleClose(toastToShow.id)}
              onMouseEnter={() => handleMouseEnter(toastToShow)}
              onMouseLeave={handleMouseLeave}
              onFocus={() => pauseToasts(toastToShow)}
              onBlur={handleBlur}
              closable
              toastIsBeingRemoved={toastToShow.isBeingRemoved}
              key={toastToShow.id}
            >
              {toastToShow.content}
            </ToastAlertBox>
          ))}
        </div>
      )}
      {children}
    </ToastContext.Provider>
  );
};

export const useToast: () => {
  addToast: (payload: AddToastPayload | string) => void;
} = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error(
      'You need to wrap your component in a ToastProvider component in ' +
        'order to use the useToast hook',
    );
  }
  const { addToast } = context;
  return {
    addToast,
  };
};
