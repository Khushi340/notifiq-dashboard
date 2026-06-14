type StatusBadgeProps = {
  status: string;
};

const statusClasses: Record<string, string> = {
  SENT: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
  QUEUED: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20",
  RETRYING: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
  FAILED: "bg-orange-500/10 text-orange-400 ring-orange-500/20",
  DEAD_LETTERED: "bg-red-500/10 text-red-400 ring-red-500/20",
  SKIPPED_BY_PREFERENCE: "bg-slate-500/10 text-slate-400 ring-slate-500/20",
  SKIPPED_BY_QUIET_HOURS: "bg-purple-500/10 text-purple-400 ring-purple-500/20",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const badgeClass =
    statusClasses[status] ?? "bg-slate-500/10 text-slate-400 ring-slate-500/20";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${badgeClass}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
