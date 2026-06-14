import { LayoutDashboard, Bell, Skull, Send, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ROUTES } from "./routes";

export interface NavLink {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_LINKS: NavLink[] = [
  { to: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { to: ROUTES.NOTIFICATIONS, label: "Notifications", icon: Bell },
  { to: ROUTES.DEAD_LETTERS, label: "Dead Letters", icon: Skull },
  { to: ROUTES.SEND_NOTIFICATION, label: "Send Notification", icon: Send },
  { to: ROUTES.PREFERENCES, label: "Preferences", icon: Settings },
];
