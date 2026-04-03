// client/src/components/Toast.jsx
import React, { useState, useEffect } from "react";
import { subscribeToToasts } from "../utils/toast.js";
import "../styles/Toast.css";

export const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((action) => {
      if (action.type === "ADD") {
        setToasts((prev) => [...prev, action.toast]);
      } else if (action.type === "REMOVE") {
        setToasts((prev) => prev.filter((t) => t.id !== action.id));
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};
