import { useState } from "react";
import { RefreshCw, Send } from "lucide-react";

import Toast from "../components/Toast";
import { notificationService } from "../services/notificationService";
import type { NotificationResponse } from "../types/types";

const NOTIFICATION_TYPES = [
  "ORDER_PLACED",
  "PAYMENT_SUCCESS",
  "PAYMENT_FAILED",
  "PROMOTION",
  "SYSTEM_ALERT",
];

const CHANNELS = ["EMAIL", "IN_APP", "WEBHOOK"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; data: NotificationResponse }
  | { status: "error"; message: string };

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

type FormValues = {
  userId: string;
  type: string;
  channel: string;
  priority: string;
  subject: string;
  message: string;
  idempotencyKey: string;
};

const createDefaultValues = (): FormValues => ({
  userId: "",
  type: "ORDER_PLACED",
  channel: "EMAIL",
  priority: "MEDIUM",
  subject: "",
  message: "",
  idempotencyKey: crypto.randomUUID(),
});

export default function SendNotification() {
  const [form, setForm] = useState<FormValues>(() => createDefaultValues());
  const [formState, setFormState] = useState<FormState>({ status: "idle" });
  const [toast, setToast] = useState<ToastState>(null);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const regenerateKey = () => {
    setForm((previous) => ({
      ...previous,
      idempotencyKey: crypto.randomUUID(),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.userId.trim() || !form.message.trim()) {
      return;
    }

    setFormState({ status: "submitting" });
    setToast(null);

    try {
      const data = await notificationService.send({
        userId: Number(form.userId),
        type: form.type,
        channel: form.channel,
        priority: form.priority,
        subject: form.subject.trim() || undefined,
        message: form.message.trim(),
        idempotencyKey: form.idempotencyKey.trim(),
      });

      setFormState({
        status: "success",
        data,
      });

      setToast({
        message: "Notification submitted successfully.",
        type: "success",
      });

      setForm(createDefaultValues());
    } catch (error) {
      console.error(error);

      setFormState({
        status: "error",
        message: "Failed to send notification. Check user ID and try again.",
      });

      setToast({
        message: "Failed to send notification.",
        type: "error",
      });
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Send Notification
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manually trigger a notification for testing or operations use
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm shadow-black/20"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              User ID
            </label>
            <input
              name="userId"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={form.userId}
              onChange={handleChange}
              placeholder="e.g. 5"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                {NOTIFICATION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Channel
              </label>
              <select
                name="channel"
                value={form.channel}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                {CHANNELS.map((channel) => (
                  <option key={channel} value={channel}>
                    {channel === "IN_APP" ? "In-App" : channel}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Priority
            </label>

            <div className="flex gap-3">
              {PRIORITIES.map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      priority,
                    }))
                  }
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition ${
                    form.priority === priority
                      ? priority === "HIGH"
                        ? "border-red-500 bg-red-500/10 text-red-400"
                        : priority === "MEDIUM"
                          ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                          : "border-slate-500 bg-slate-500/10 text-slate-400"
                      : "border-slate-700 text-slate-600 hover:border-slate-600 hover:text-slate-400"
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Subject{" "}
              <span className="normal-case text-slate-600">(optional)</span>
            </label>
            <input
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. Your order has been placed"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Message
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Notification message body..."
              rows={2}
              required
              className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Idempotency Key
            </label>

            <div className="flex gap-2">
              <input
                name="idempotencyKey"
                type="text"
                value={form.idempotencyKey}
                onChange={handleChange}
                className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 font-mono text-xs text-slate-400 focus:border-indigo-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={regenerateKey}
                className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-400 transition hover:border-slate-600 hover:text-white"
                title="Generate new key"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Prevents duplicate notification creation during retries or repeat
              submissions.
            </p>
          </div>

          {formState.status === "error" && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {formState.message}
            </div>
          )}

          <button
            type="submit"
            disabled={formState.status === "submitting"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={14} />
            {formState.status === "submitting"
              ? "Sending..."
              : "Send Notification"}
          </button>
        </form>

        <div>
          {formState.status === "success" ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <p className="mb-4 text-sm font-semibold text-emerald-400">
                ✓ Notification submitted successfully
              </p>

              <div className="space-y-3">
                {[
                  ["ID", `#${formState.data.id}`],
                  ["Status", formState.data.status],
                  ["Channel", formState.data.channel],
                  ["Type", formState.data.type.replaceAll("_", " ")],
                  ["Priority", formState.data.priority],
                  [
                    "Created",
                    new Date(formState.data.createdAt).toLocaleString(),
                  ],
                  ["Idempotency Key", formState.data.idempotencyKey],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 border-b border-slate-800 pb-3 last:border-0"
                  >
                    <span className="text-xs text-slate-500">{label}</span>
                    <span className="break-all text-right font-mono text-xs text-slate-300">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <p className="text-sm font-medium text-slate-400">
                Response Preview
              </p>
              <p className="mt-2 text-xs text-slate-600">
                Fill the form and send a notification. The API response will
                appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
