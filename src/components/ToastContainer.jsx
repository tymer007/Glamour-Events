import React, { useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import Toast from './Toast';
import { setToastInstance } from '../utils/toast';

const ToastContainer = () => {
  const { toasts, removeToast, success, error, warning, info } = useToast();

  // Register toast instance for use outside React components
  useEffect(() => {
    setToastInstance({ success, error, warning, info });
  }, [success, error, warning, info]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
