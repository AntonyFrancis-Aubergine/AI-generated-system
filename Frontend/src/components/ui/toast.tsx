import { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";

interface ToastProps {
  title: string;
  description: string;
  variant?: "default" | "destructive";
  duration?: number;
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState<(ToastProps & { id: number })[]>([]);

  useEffect(() => {
    const handleToast = (event: CustomEvent<ToastProps>) => {
      const newToast = {
        ...event.detail,
        id: Date.now(),
      };
      setToasts((prev) => [...prev, newToast]);

      // Auto-remove toast after duration
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== newToast.id));
      }, event.detail.duration || 5000);
    };

    window.addEventListener("toast" as any, handleToast as any);

    return () => {
      window.removeEventListener("toast" as any, handleToast as any);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className={`rounded-lg shadow-lg p-4 flex items-start gap-3 ${
              toast.variant === "destructive"
                ? "bg-red-50 border border-red-200 text-red-900"
                : "bg-white border border-gray-100"
            }`}
          >
            <div className="flex-shrink-0 pt-0.5">
              {toast.variant === "destructive" ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{toast.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{toast.description}</p>
            </div>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
              className="flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Initialize toast container
let containerElement: HTMLDivElement | null = null;

const initToastContainer = () => {
  if (typeof window === "undefined") return;

  if (!containerElement) {
    containerElement = document.createElement("div");
    document.body.appendChild(containerElement);
    const root = createRoot(containerElement);
    root.render(<ToastContainer />);
  }
};

// Toast function
export const toast = (props: ToastProps) => {
  if (typeof window === "undefined") return;

  initToastContainer();

  const event = new CustomEvent("toast", {
    detail: props,
  });

  window.dispatchEvent(event);
};
