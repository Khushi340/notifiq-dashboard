import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import { ROUTES } from "./constants/routes";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-slate-950 p-8">
        <Routes>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}
