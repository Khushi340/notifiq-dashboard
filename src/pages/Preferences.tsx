import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

import Toast from "../components/Toast";
import { userService } from "../services/userService";
import type {
  FetchState,
  UpdatePreferenceRequest,
  UserPreference,
} from "../types/types";

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

type BooleanPreferenceField =
  | "emailEnabled"
  | "inAppEnabled"
  | "webhookEnabled"
  | "quietHoursEnabled";

const CHANNELS = ["EMAIL", "IN_APP", "WEBHOOK"];

const defaultPreferenceForm: UpdatePreferenceRequest = {
  emailEnabled: true,
  inAppEnabled: true,
  webhookEnabled: false,
  webhookUrl: null,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  preferredChannel: "EMAIL",
};

function mapPreferenceToForm(
  preference: UserPreference,
): UpdatePreferenceRequest {
  return {
    emailEnabled: preference.emailEnabled,
    inAppEnabled: preference.inAppEnabled,
    webhookEnabled: preference.webhookEnabled,
    webhookUrl: preference.webhookUrl,
    quietHoursEnabled: preference.quietHoursEnabled,
    quietHoursStart: preference.quietHoursStart,
    quietHoursEnd: preference.quietHoursEnd,
    preferredChannel: preference.preferredChannel,
  };
}

function normalizeTime(value: string | null): string | null {
  if (!value) {
    return null;
  }

  if (value.length === 5) {
    return `${value}:00`;
  }

  return value;
}

function formatChannel(channel: string) {
  if (channel === "IN_APP") {
    return "In-App";
  }

  return channel.charAt(0) + channel.slice(1).toLowerCase();
}

export default function Preferences() {
  const [userId, setUserId] = useState("");
  const [submittedId, setSubmittedId] = useState<number | null>(null);
  const [state, setState] = useState<FetchState<UserPreference> | null>(null);
  const [form, setForm] = useState<UpdatePreferenceRequest>(
    defaultPreferenceForm,
  );
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    if (!submittedId) {
      return;
    }

    setState({ status: "loading" });

    userService
      .getPreference(submittedId)
      .then((data) => {
        setState({ status: "success", data });
        setForm(mapPreferenceToForm(data));
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setState(null);
          setForm(defaultPreferenceForm);
          setToast({
            message: "No preferences found. Defaults loaded for this user.",
            type: "success",
          });
          return;
        }

        setState({
          status: "error",
          message: "Failed to load preferences",
        });
      });
  }, [submittedId]);

  const loadPreferences = () => {
    const trimmedUserId = userId.trim();

    if (!trimmedUserId) {
      return;
    }

    setToast(null);
    setSubmittedId(Number(trimmedUserId));
  };

  const handleToggle = (field: BooleanPreferenceField) => {
    setForm((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value || null,
    }));
  };

  const handleSave = async () => {
    if (!submittedId) {
      return;
    }

    setSaving(true);
    setToast(null);

    try {
      const payload: UpdatePreferenceRequest = {
        ...form,
        webhookUrl: form.webhookEnabled ? form.webhookUrl : null,
        quietHoursStart: form.quietHoursEnabled
          ? normalizeTime(form.quietHoursStart)
          : null,
        quietHoursEnd: form.quietHoursEnabled
          ? normalizeTime(form.quietHoursEnd)
          : null,
      };

      const updated = await userService.updatePreference(submittedId, payload);

      setState({ status: "success", data: updated });
      setForm(mapPreferenceToForm(updated));

      setToast({
        message: "Preferences saved successfully.",
        type: "success",
      });
    } catch {
      setToast({
        message: "Failed to save preferences.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Preferences
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage notification delivery preferences for a user
        </p>
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              loadPreferences();
            }
          }}
          placeholder="Enter user ID"
          className="w-48 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
        />

        <button
          type="button"
          disabled={!userId.trim()}
          onClick={loadPreferences}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Load
        </button>
      </div>

      {!submittedId && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center">
          <Settings size={24} className="mx-auto mb-3 text-slate-600" />
          <p className="text-sm text-slate-500">
            Enter a user ID to load and edit their preferences
          </p>
        </div>
      )}

      {state?.status === "loading" && (
        <p className="text-sm text-slate-400">Loading preferences...</p>
      )}

      {state?.status === "error" && (
        <p className="text-sm text-red-400">{state.message}</p>
      )}

      {submittedId &&
        state?.status !== "loading" &&
        state?.status !== "error" && (
          <div className="max-w-xl space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-sm shadow-black/20">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Channels
              </p>

              {[
                { key: "emailEnabled" as const, label: "Email" },
                { key: "inAppEnabled" as const, label: "In-App" },
                { key: "webhookEnabled" as const, label: "Webhook" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{label}</span>

                  <button
                    type="button"
                    onClick={() => handleToggle(key)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      form[key] ? "bg-indigo-500" : "bg-slate-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        form[key] ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800" />

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Preferred Channel
              </p>

              <div className="flex gap-3">
                {CHANNELS.map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() =>
                      setForm((previous) => ({
                        ...previous,
                        preferredChannel: channel,
                      }))
                    }
                    className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition ${
                      form.preferredChannel === channel
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                        : "border-slate-700 text-slate-600 hover:border-slate-600 hover:text-slate-400"
                    }`}
                  >
                    {formatChannel(channel)}
                  </button>
                ))}
              </div>
            </div>

            {form.webhookEnabled && (
              <>
                <div className="border-t border-slate-800" />

                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Webhook URL
                  </p>

                  <input
                    type="url"
                    name="webhookUrl"
                    value={form.webhookUrl ?? ""}
                    onChange={handleChange}
                    placeholder="https://your-service.com/webhook"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div className="border-t border-slate-800" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">Quiet Hours</p>
                  <p className="text-xs text-slate-500">
                    Notifications are queued and delivered after quiet hours end
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggle("quietHoursEnabled")}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    form.quietHoursEnabled ? "bg-indigo-500" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      form.quietHoursEnabled ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {form.quietHoursEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">Start</label>
                    <input
                      type="time"
                      name="quietHoursStart"
                      value={form.quietHoursStart?.slice(0, 5) ?? ""}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">End</label>
                    <input
                      type="time"
                      name="quietHoursEnd"
                      value={form.quietHoursEnd?.slice(0, 5) ?? ""}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-500 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>
        )}

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
