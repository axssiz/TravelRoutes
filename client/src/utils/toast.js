// client/src/utils/toast.js
/**
 * Простая система уведомлений (Toast)
 */

let toastId = 0;
const listeners = [];

export const createToast = (message, type = "info", duration = 3000) => {
  const id = toastId++;
  const toast = { id, message, type };

  listeners.forEach((listener) => listener({ type: "ADD", toast }));

  if (duration > 0) {
    setTimeout(() => {
      listeners.forEach((listener) => listener({ type: "REMOVE", id }));
    }, duration);
  }

  return id;
};

export const removeToast = (id) => {
  listeners.forEach((listener) => listener({ type: "REMOVE", id }));
};

export const subscribeToToasts = (listener) => {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
};

// Удобные функции
export const toastSuccess = (message) => createToast(message, "success", 3000);
export const toastError = (message) => createToast(message, "error", 4000);
export const toastInfo = (message) => createToast(message, "info", 3000);
export const toastWarning = (message) => createToast(message, "warning", 3000);
