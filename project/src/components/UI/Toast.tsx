import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, InfoIcon } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message?: string;
  type?: ToastType;
  duration?: number;
}

// Global toast state management (singleton pattern)
let toastHandler: (props: ToastProps) => void = () => {};

export const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
  toastHandler({ message, type, duration });
};

const Toast: React.FC = () => {
  const [toast, setToast] = useState<ToastProps | null>(null);
  const [visible, setVisible] = useState(false);

  // Register the toast handler
  useEffect(() => {
    toastHandler = (props: ToastProps) => {
      setToast(props);
      setVisible(true);
    };
  }, []);

  // Handle toast visibility and auto-hide
  useEffect(() => {
    if (!toast) return;
    
    const timer = setTimeout(() => {
      setVisible(false);
    }, toast.duration || 3000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  // Handle closing animation
  const handleClose = () => {
    setVisible(false);
  };

  // Clean up toast data after animation
  const handleAnimationEnd = () => {
    if (!visible) {
      setTimeout(() => setToast(null), 300);
    }
  };

  if (!toast) return null;

  const { message, type = 'info' } = toast;

  const bgColor = {
    success: 'bg-success-500',
    error: 'bg-error-500',
    info: 'bg-primary-500',
  }[type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: InfoIcon,
  }[type];

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center max-w-md`}>
        <Icon size={20} className="mr-2 flex-shrink-0" />
        <p className="flex-grow">{message}</p>
        <button 
          onClick={handleClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;