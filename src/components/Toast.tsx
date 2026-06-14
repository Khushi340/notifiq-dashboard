import { useEffect } from "react";
import { CheckCircle, X, XCircle } from "lucide-react";

type ToastProps = {
  message: string;
  type: "success" | "error";
  onClose: () => void;
};

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg shadow-black/30 ${
        type === "success"
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-red-500/20 bg-red-500/10 text-red-400"
      }`}
    >
      {type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}

      <p className="text-sm font-medium">{message}</p>

      <button
        type="button"
        onClick={onClose}
        className="ml-2 opacity-60 transition hover:opacity-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}
