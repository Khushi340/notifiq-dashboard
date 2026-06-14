import { useEffect, useState } from "react";

import api from "../api/api";
import type { FetchState, NotificationResponse } from "../types/types";
import StatusBadge from "./StatusBadge";

export default function RecentNotifications() {
  const [state, setState] = useState<FetchState<NotificationResponse[]>>({
    status: "loading",
  });

  useEffect(() => {
    setState({ status: "loading" });

    api
      .get<NotificationResponse[]>("/api/notifications/recent")
      .then((response) => {
        setState({
          status: "success",
          data: response.data,
        });
      })
      .catch(() => {
        setState({
          status: "error",
          message: "Failed to load recent notifications",
        });
      });
  }, []);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <p className="mt-1 text-sm text-slate-500">
          Latest notifications processed by the platform
        </p>
      </div>

      {state.status === "loading" && (
        <p className="text-sm text-slate-400">
          Loading recent notifications...
        </p>
      )}

      {state.status === "error" && (
        <p className="text-sm text-red-400">{state.message}</p>
      )}

      {state.status === "success" && state.data.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400">
          No recent notifications found.
        </div>
      )}

      {state.status === "success" && state.data.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-sm shadow-black/20">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                {["ID", "Type", "Channel", "Status", "Created At"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {state.data.slice(0, 5).map((notification) => (
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
                    <StatusBadge status={notification.status} />
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {new Date(notification.createdAt).toLocaleString()}
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
