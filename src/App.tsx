import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import { ROUTES } from "./constants/routes";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";
import DeadLetters from "./pages/DeadLetters";
import SendNotification from "./pages/SendNotification";
import Preferences from "./pages/Preferences";

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
        <Routes>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
          <Route path={ROUTES.DEAD_LETTERS} element={<DeadLetters />} />
          <Route
            path={ROUTES.SEND_NOTIFICATION}
            element={<SendNotification />}
          />
          <Route path={ROUTES.PREFERENCES} element={<Preferences />} />
        </Routes>
      </main>
    </div>
  );
}
