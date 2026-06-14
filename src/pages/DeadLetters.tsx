import { useEffect, useState } from "react";
import { RefreshCw, RotateCcw } from "lucide-react";

import { deadLetterService } from "../services/deadLetterService";
import PriorityBadge from "../components/PriorityBadge";
import type { DeadLetterResponse, FetchState } from "../types/types";
import Toast from "../components/Toast";

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

export default function DeadLetters() {
  const [state, setState] = useState<FetchState<DeadLetterResponse[]>>({
    status: "loading",
  });
  const [replayingIds, setReplayingIds] = useState<Set<number>>(new Set());
  const [refresh, setRefresh] = useState(0);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    setState({ status: "loading" });

    deadLetterService
      .getAll()
      .then((data) => {
        setState({
          status: "success",
          data,
        });
      })
      .catch(() => {
        setState({
          status: "error",
          message: "Failed to load dead letters",
        });
      });
  }, [refresh]);

  const handleReplay = async (deadLetterId: number) => {
    setToast(null);
    setReplayingIds((previous) => new Set(previous).add(deadLetterId));

    try {
      await deadLetterService.replay(deadLetterId);

      setState((previous) => {
        if (previous.status !== "success") {
          return previous;
        }

        return {
          status: "success",
          data: previous.data.filter(
            (deadLetter) => deadLetter.id !== deadLetterId,
          ),
        };
      });

      setToast({
        message: "Notification requeued. Scheduler will pick it up shortly.",
        type: "success",
      });
    } catch {
      setToast({
        message: "Failed to replay notification. Please try again.",
        type: "error",
      });
    } finally {
      setReplayingIds((previous) => {
        const next = new Set(previous);
        next.delete(deadLetterId);
        return next;
      });
    }
  };

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Dead Letters
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Notifications that exhausted all retry attempts
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefresh((value) => value + 1)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {state.status === "loading" && (
        <p className="text-sm text-slate-400">Loading dead letters...</p>
      )}

      {state.status === "error" && (
        <p className="text-sm text-red-400">{state.message}</p>
      )}

      {state.status === "success" && state.data.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center">
          <p className="text-sm font-medium text-slate-400">
            No dead letters 🎉
          </p>
          <p className="mt-1 text-xs text-slate-600">
            All notifications are either delivered, queued, or still retrying
          </p>
        </div>
      )}

      {state.status === "success" && state.data.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm shadow-black/20">
          <div className="border-b border-slate-800 px-5 py-4">
            <p className="text-sm font-medium text-slate-300">
              {state.data.length} dead letter
              {state.data.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {[
                  "#",
                  "Type",
                  "Channel",
                  "Priority",
                  "Retries",
                  "Reason",
                  "Failed At",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {state.data.map((deadLetter, index) => (
                <tr
                  key={deadLetter.id}
                  className="border-b border-slate-800/60 transition last:border-0 hover:bg-slate-800/40"
                >
                  <td className="px-5 py-4 font-medium text-slate-500">
                    {index + 1}
                  </td>

                  <td className="min-w-[220px] px-5 py-4">
                    <p className="font-medium text-slate-300">
                      {deadLetter.type.replaceAll("_", " ")}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Notification #{deadLetter.notificationId} · User #
                      {deadLetter.userId}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    {deadLetter.channel}
                  </td>

                  <td className="px-5 py-4">
                    <PriorityBadge priority={deadLetter.priority} />
                  </td>

                  <td className="px-5 py-4 text-center text-slate-400">
                    {deadLetter.retryCount}
                  </td>

                  <td className="max-w-[220px] px-5 py-4">
                    <p
                      className="truncate text-xs text-red-400"
                      title={deadLetter.reason}
                    >
                      {deadLetter.reason}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {new Date(deadLetter.failedAt).toLocaleString()}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => handleReplay(deadLetter.id)}
                      disabled={replayingIds.has(deadLetter.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-400 transition hover:bg-indigo-500/20 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RotateCcw size={12} />
                      {replayingIds.has(deadLetter.id)
                        ? "Replaying..."
                        : "Replay"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
