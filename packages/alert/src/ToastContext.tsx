import React from 'react';
import { ToastAlertBox } from './AlertBoxes';

type ToastId = string;
type ToastVariants = 'success' | 'info';
type ToastType = {
  title?: string;
  content: React.ReactNode;
  id: ToastId;
  variant: ToastVariants;
};

type ToastContextType = {
  addToast: (payload: AddToastPayload) => void;
  removeToast: (id: ToastId) => void;
  toasts: ToastType[];
};
const ToastContext = React.createContext<ToastContextType | null>(null);

type AddToastPayload =
  | { title?: string; content: React.ReactNode; variant?: ToastVariants }
  | string;

type ToastAction =
  | { type: 'ADD_TOAST'; payload: ToastType }
  | { type: 'REMOVE_TOAST'; payload: ToastId };

const toastReducer = (
  prevToasts: ToastType[],
  action: ToastAction,
): ToastType[] => {
  switch (action.type) {
    case 'ADD_TOAST':
      return [action.payload, ...prevToasts];
    case 'REMOVE_TOAST':
      return prevToasts.filter(toast => toast.id !== action.payload);
  }
};

const createUniqueId = () =>
  Math.random()
    .toString()
    .substring(2);

const createToast = (toast: AddToastPayload, id: ToastId): ToastType => {
  if (typeof toast === 'string') {
    return { id, content: toast, variant: 'success' };
  } else {
    return { id, variant: 'success', ...toast };
  }
};

type ToastProviderProps = {
  delay?: number;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({
  delay = 6000,
  children,
}) => {
  const [toasts, dispatch] = React.useReducer(toastReducer, []);
  const [hoveringId, setHovering] = React.useState<string>();
  const timeoutIdRefs = React.useRef<{ [key: string]: NodeJS.Timeout }>({});

  const removeToast = React.useCallback((id: ToastId) => {
    clearTimeout(timeoutIdRefs.current[id]);
    dispatch({ type: 'REMOVE_TOAST', payload: id });
    delete timeoutIdRefs.current[id];
  }, []);

  const addToast = React.useCallback((toast: AddToastPayload) => {
    const id = createUniqueId();
    const payload = createToast(toast, id);
    dispatch({ type: 'ADD_TOAST', payload });
    timeoutIdRefs.current[id] = setTimeout(() => removeToast(id), delay);
  }, []);

  const handleMouseEnter = (toastId: ToastId) => () => {
    setHovering(toastId);
    Object.values(timeoutIdRefs.current).forEach(timeoutId =>
      clearTimeout(timeoutId),
    );
    timeoutIdRefs.current = {};
  };

  const handleMouseLeave = () => {
    setHovering(undefined);
    toasts.forEach(toast => {
      timeoutIdRefs.current[toast.id] = setTimeout(
        () => removeToast(toast.id),
        delay,
      );
    });
  };

  const handleClose = (toastId: ToastId) => () => {
    handleMouseLeave();
    removeToast(toastId);
  };

  return (
    <ToastContext.Provider
      value={React.useMemo(() => ({ toasts, addToast, removeToast }), [toasts])}
    >
      {toasts.length > 0 && (
        <div className="entur-toast-container">
          {toasts.slice(0, 3).map(toastToShow => (
            <ToastAlertBox
              variant={toastToShow.variant}
              title={toastToShow.title}
              onClose={handleClose(toastToShow.id)}
              onMouseEnter={handleMouseEnter(toastToShow.id)}
              onMouseLeave={handleMouseLeave}
              closable={hoveringId === toastToShow.id}
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

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error(
      'You need to wrap your component in a ToastProvider component in ' +
        'order to use the useToast hook',
    );
  }
  const { addToast, toasts } = context;
  return {
    addToast,
    toasts,
  };
};
