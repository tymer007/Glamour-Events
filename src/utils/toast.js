// Toast utility for use outside of React components
let toastInstance = null;

export const setToastInstance = (instance) => {
  toastInstance = instance;
};

export const toast = {
  success: (message, options = {}) => {
    if (toastInstance) {
      return toastInstance.success(message, options);
    }
    console.log('Toast success:', message);
  },
  error: (message, options = {}) => {
    if (toastInstance) {
      return toastInstance.error(message, options);
    }
    console.log('Toast error:', message);
  },
  warning: (message, options = {}) => {
    if (toastInstance) {
      return toastInstance.warning(message, options);
    }
    console.log('Toast warning:', message);
  },
  info: (message, options = {}) => {
    if (toastInstance) {
      return toastInstance.info(message, options);
    }
    console.log('Toast info:', message);
  },
};
