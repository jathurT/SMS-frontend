import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Layout from "./Layout";
import DepartmentPage from "./pages/department/DepartmentPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"
          element={
            <Layout />
          }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/department/*" element={<DepartmentPage />} />
        </Route>
      </Routes>
    </Router>
  );
}