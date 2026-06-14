import { useState } from "react";
import { RefreshCw } from "lucide-react";

import RecentNotifications from "../components/RecentNotifications";
import StatsCards from "../components/StatCards";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(0);

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Live notification statistics from NotifiQ backend
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefresh((value) => value + 1)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      <StatsCards refresh={refresh} />

      <RecentNotifications refresh={refresh} />
    </section>
  );
}
