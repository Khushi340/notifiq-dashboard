import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { notificationService } from "../services/notificationService";
import PriorityBadge from "../components/PriorityBadge";
import StatusBadge from "../components/StatusBadge";
import type { FetchState, NotificationResponse } from "../types/types";

export default function Notifications() {
  const [userId, setUserId] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [state, setState] = useState<FetchState<NotificationResponse[]> | null>(
    null,
  );

  useEffect(() => {
    if (!submittedId) {
      return;
    }

    setState({ status: "loading" });

    notificationService
      .getByUserId(submittedId)
      .then((data) => {
        setState({
          status: "success",
          data,
        });
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setState({
            status: "error",
            message: `User #${submittedId} not found`,
          });
          return;
        }

        setState({
          status: "error",
          message: "Failed to load notifications. Please try again.",
        });
      });
  }, [submittedId]);

  const handleSearch = () => {
    const trimmedUserId = userId.trim();

    if (!trimmedUserId) {
      return;
    }

    setSubmittedId(trimmedUserId);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          View all notifications for a specific user
        </p>
      </div>

      <div className="flex gap-3">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter user ID"
            className="w-48 rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          disabled={!userId.trim()}
          className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Load
        </button>
      </div>

      {!submittedId && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center">
          <p className="text-sm text-slate-500">
            Enter a user ID above to load their notifications
          </p>
        </div>
      )}

      {submittedId && state?.status === "loading" && (
        <p className="text-sm text-slate-400">Loading notifications...</p>
      )}

      {submittedId && state?.status === "error" && (
        <p className="text-sm text-red-400">{state.message}</p>
      )}

      {submittedId &&
        state?.status === "success" &&
        state.data.length === 0 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-10 text-center">
            <p className="text-sm text-slate-500">
              No notifications found for user #{submittedId}
            </p>
          </div>
        )}

      {submittedId && state?.status === "success" && state.data.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm shadow-black/20">
          <div className="border-b border-slate-800 px-5 py-4">
            <p className="text-sm font-medium text-slate-300">
              {state.data.length} notification
              {state.data.length !== 1 ? "s" : ""} for user #{submittedId}
            </p>
          </div>

          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                {[
                  "ID",
                  "Type",
                  "Channel",
                  "Priority",
                  "Status",
                  "Retries",
                  "Created At",
                  "Sent At",
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
              {state.data.map((notification) => (
                <tr
                  key={notification.id}
                  className="border-b border-slate-800/60 transition last:border-0 hover:bg-slate-800/40"
                >
                  <td className="px-5 py-4 font-medium text-slate-500">
                    #{notification.id}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {notification.type.replaceAll("_", " ")}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {notification.channel}
                  </td>

                  <td className="px-5 py-4">
                    <PriorityBadge priority={notification.priority} />
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={notification.status} />
                  </td>

                  <td className="px-5 py-4 text-center text-slate-400">
                    {notification.retryCount}
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {notification.sentAt
                      ? new Date(notification.sentAt).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
