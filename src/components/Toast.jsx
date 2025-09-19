import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faExclamationTriangle, 
  faInfoCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const Toast = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return faCheckCircle;
      case 'error':
        return faExclamationCircle;
      case 'warning':
        return faExclamationTriangle;
      case 'info':
      default:
        return faInfoCircle;
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'text-green-500',
          title: 'text-green-800',
          message: 'text-green-700',
          button: 'text-green-500 hover:text-green-700'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-500',
          title: 'text-red-800',
          message: 'text-red-700',
          button: 'text-red-500 hover:text-red-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-500',
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          button: 'text-yellow-500 hover:text-yellow-700'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-500',
          title: 'text-blue-800',
          message: 'text-blue-700',
          button: 'text-blue-500 hover:text-blue-700'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`
        relative flex items-start p-4 rounded-lg border shadow-lg
        ${colors.bg} ${colors.border}
        transform transition-all duration-300 ease-in-out
        hover:shadow-xl
      `}
      style={{
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${colors.icon}`}>
        <FontAwesomeIcon icon={getIcon()} className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="ml-3 flex-1">
        {toast.title && (
          <h4 className={`font-cormorant font-semibold text-sm ${colors.title}`}>
            {toast.title}
          </h4>
        )}
        <p className={`font-cormorant text-sm ${colors.message} ${toast.title ? 'mt-1' : ''}`}>
          {toast.message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => onRemove(toast.id)}
        className={`
          flex-shrink-0 ml-4 ${colors.button}
          transition-colors duration-200
        `}
        aria-label="Close notification"
      >
        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
      </button>

      {/* Progress Bar */}
      {toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-current opacity-30 animate-progress"
            style={{
              animationDuration: `${toast.duration}ms`,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards',
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-progress {
          animation-name: progress;
        }
      `}</style>
    </div>
  );
};

export default Toast;
