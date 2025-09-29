// src/context/ToastProvider.jsx
import React, { useMemo, useState } from "react";
import { ToastContext } from "./ToastContextBase.js"; // explicit .js extension

let idCounter = 0;

export function ToastProvider({ children, position = "top-right" }) {
  const [toasts, setToasts] = useState([]);

  const show = ({ title = "", message = "", type = "info", timeout = 5000 } = {}) => {
    const id = `t_${Date.now()}_${++idCounter}`;
    const t = { id, title, message, type, timeout };
    setToasts((s) => [t, ...s]);
    if (timeout > 0) {
      setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), timeout);
    }
    return id;
  };

  const hide = (id) => setToasts((s) => s.filter((x) => x.id !== id));
  const value = useMemo(() => ({ show, hide }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} hide={hide} position={position} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts = [], hide, position }) {
  const posClass =
    position === "top-right"
      ? "top-6 right-6"
      : position === "top-left"
      ? "top-6 left-6"
      : position === "bottom-right"
      ? "bottom-6 right-6"
      : "bottom-6 left-6";

  return (
    <div className={`fixed z-50 ${posClass} flex flex-col gap-3 max-w-sm`}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`rounded-lg shadow p-3 border flex items-start gap-3 transition hover:scale-[1.01] ${
            t.type === "success"
              ? "bg-green-50 border-green-200"
              : t.type === "error"
              ? "bg-red-50 border-red-200"
              : t.type === "warning"
              ? "bg-yellow-50 border-yellow-200"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex-1">
            {t.title && <div className="font-semibold text-sm mb-1">{t.title}</div>}
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{t.message}</div>
          </div>
          <button onClick={() => hide(t.id)} className="text-gray-400 hover:text-gray-600 ml-3 text-sm" aria-label="Dismiss">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
