import { NavLink } from "react-router-dom";

import { NAV_LINKS } from "../constants/navigation";

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-800 bg-slate-950 px-4 py-6">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          NotifiQ
        </h1>
        <p className="mt-1 text-xs text-slate-500">Ops Dashboard</p>
      </div>

      <nav className="flex flex-col gap-2">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-indigo-500 text-white shadow-sm shadow-indigo-500/30"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white",
              ].join(" ")
            }
          >
            <link.icon size={16} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-4">
        <p className="px-2 text-xs text-slate-500">v1.0.0 · NotifiQ</p>
      </div>
    </aside>
  );
}
