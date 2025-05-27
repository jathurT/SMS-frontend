import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Layout from "./Layout";
import DepartmentPage from "./pages/department/DepartmentPage";
import LecturerPage from "./pages/lecturer/LecturerPage";
import LecturerDetails from "./pages/lecturer/LecturerDetails";
import DepartmentDetailsPage from "./pages/department/DepartmentDetailsPage ";

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
          <Route path="/department/:id" element={<DepartmentDetailsPage />} />
          <Route path="/lecturer/*" element={<LecturerPage />} />
          <Route path="/lecturer/:id" element={<LecturerDetails />} />
        </Route>
      </Routes>
    </Router>
  );
}