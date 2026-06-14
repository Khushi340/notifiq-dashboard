type PriorityBadgeProps = {
  priority: string;
};

const priorityClasses: Record<string, string> = {
  HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
  MEDIUM: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  LOW: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const badgeClass = priorityClasses[priority] ?? priorityClasses.LOW;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
    >
      {priority}
    </span>
  );
}
