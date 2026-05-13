import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const push = useCallback((message, type = "info") => {
    const id = uid();
    setToasts((current) => [...current, { id, message, type }]);

    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(
    () => ({
      toastSuccess: (msg) => push(msg, "success"),
      toastError: (msg) => push(msg, "error"),
      toastInfo: (msg) => push(msg, "info")
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[120] flex w-[min(92vw,380px)] flex-col gap-3">
        {toasts.map((toast) => (
          <button
            key={toast.id}
            type="button"
            onClick={() => dismiss(toast.id)}
            className={
              "pointer-events-auto rounded-2xl px-4 py-3 text-left text-sm font-semibold shadow-soft ring-1 backdrop-blur transition " +
              (toast.type === "success"
                ? "bg-teal/20 text-teal ring-teal/40"
                : toast.type === "error"
                  ? "bg-red-500/20 text-red-200 ring-red-400/40"
                  : "bg-surface/90 text-white ring-white/15")
            }
          >
            {toast.message}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
