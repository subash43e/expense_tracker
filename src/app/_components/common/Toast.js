'use client';

import React, { useState, useCallback, createContext } from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineClose } from 'react-icons/ai';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now();
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  const bgColor =
    toast.type === 'success'
      ? 'bg-green-50'
      : toast.type === 'error'
        ? 'bg-red-50'
        : 'bg-blue-50';

  const borderColor =
    toast.type === 'success'
      ? 'border-green-200'
      : toast.type === 'error'
        ? 'border-red-200'
        : 'border-blue-200';

  const textColor =
    toast.type === 'success'
      ? 'text-green-800'
      : toast.type === 'error'
        ? 'text-red-800'
        : 'text-blue-800';

  const iconColor =
    toast.type === 'success'
      ? 'text-green-500'
      : toast.type === 'error'
        ? 'text-red-500'
        : 'text-blue-500';

  const Icon =
    toast.type === 'success'
      ? AiOutlineCheckCircle
      : toast.type === 'error'
        ? AiOutlineCloseCircle
        : AiOutlineCheckCircle;

  return (
    <div
      className={`${bgColor} ${borderColor} border-l-4 rounded-lg shadow-md p-4 flex items-start gap-3 max-w-sm animate-in slide-in-from-top-2 duration-300`}
      role="alert"
    >
      <Icon className={`${iconColor} shrink-0 text-xl mt-0.5`} />
      <p className={`${textColor} text-sm font-medium flex-1`}>{toast.message}</p>
      <button
        onClick={onRemove}
        className={`${textColor} hover:opacity-70 shrink-0`}
        aria-label="Close notification"
      >
        <AiOutlineClose className="text-lg" />
      </button>
    </div>
  );
}
