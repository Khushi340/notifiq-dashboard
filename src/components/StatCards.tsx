import { useEffect, useState } from "react";
import {
  BarChart3,
  BellOff,
  CheckCircle,
  Clock,
  RefreshCw,
  Skull,
  SkipForward,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import api from "../api/api";
import type { FetchState, NotificationStats } from "../types/types";

type StatsCardsProps = {
  refresh: number;
};

const cards: {
  key: keyof NotificationStats;
  label: string;
  Icon: LucideIcon;
  borderClass: string;
  iconClass: string;
}[] = [
  {
    key: "totalNotifications",
    label: "Total",
    Icon: BarChart3,
    borderClass: "border-indigo-500",
    iconClass: "text-indigo-400",
  },
  {
    key: "sentNotifications",
    label: "Sent",
    Icon: CheckCircle,
    borderClass: "border-emerald-500",
    iconClass: "text-emerald-400",
  },
  {
    key: "queuedNotifications",
    label: "Queued",
    Icon: Clock,
    borderClass: "border-yellow-500",
    iconClass: "text-yellow-400",
  },
  {
    key: "retryingNotifications",
    label: "Retrying",
    Icon: RefreshCw,
    borderClass: "border-blue-500",
    iconClass: "text-blue-400",
  },
  {
    key: "failedNotifications",
    label: "Failed",
    Icon: XCircle,
    borderClass: "border-orange-500",
    iconClass: "text-orange-400",
  },
  {
    key: "deadLetteredNotifications",
    label: "Dead Lettered",
    Icon: Skull,
    borderClass: "border-red-500",
    iconClass: "text-red-400",
  },
  {
    key: "skippedByPreferenceNotifications",
    label: "Skipped",
    Icon: SkipForward,
    borderClass: "border-slate-500",
    iconClass: "text-slate-400",
  },
  {
    key: "unreadInAppNotifications",
    label: "Unread In-App",
    Icon: BellOff,
    borderClass: "border-purple-500",
    iconClass: "text-purple-400",
  },
];

export default function StatsCards({ refresh }: StatsCardsProps) {
  const [state, setState] = useState<FetchState<NotificationStats>>({
    status: "loading",
  });

  useEffect(() => {
    setState({ status: "loading" });

    api
      .get<NotificationStats>("/api/notifications/stats")
      .then((response) => {
        setState({ status: "success", data: response.data });
      })
      .catch(() => {
        setState({
          status: "error",
          message: "Failed to load notification stats",
        });
      });
  }, [refresh]);

  if (state.status === "loading") {
    return <p className="text-slate-400">Loading stats...</p>;
  }

  if (state.status === "error") {
    return <p className="text-red-400">{state.message}</p>;
  }

  const stats = state.data;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, label, Icon, borderClass, iconClass }) => (
        <div
          key={key}
          className={`h-full rounded-2xl border-t-2 ${borderClass} bg-slate-900/90 p-6 shadow-sm shadow-black/20 transition duration-200 hover:-translate-y-1 hover:bg-slate-900 hover:shadow-lg hover:shadow-black/30`}
        >
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-400">{label}</p>
            <Icon size={18} className={iconClass} />
          </div>

          <p className="text-4xl font-bold tracking-tight text-white">
            {stats[key]}
          </p>
        </div>
      ))}
    </div>
  );
}
