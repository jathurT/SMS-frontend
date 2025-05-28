import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Layout from "./Layout";
import DepartmentPage from "./pages/department/DepartmentPage";
import LecturerPage from "./pages/lecturer/LecturerPage";
import LecturerDetails from "./pages/lecturer/LecturerDetails";
import DepartmentDetailsPage from "./pages/department/DepartmentDetailsPage ";
import StudentPage from "./pages/student/StudentPage";
import StudentDetails from "./pages/student/StudentDetails";
import CoursePage from "./pages/course/CoursePage";
import CourseDetails from "./pages/course/CourseDetails";
import EnrollmentPage from "./pages/enrollment/EnrollmentPage";
import AttendancePage from "./pages/attendace/AttendancePage";
import SessionPage from "./pages/session/SessionPage";
import SessionDetails from "./pages/session/SessionDetails";

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
          <Route path="/student/*" element={<StudentPage />} />
          <Route path="/student/:id" element={<StudentDetails/>} />
          <Route path="/course/*" element={<CoursePage />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/enrollment/*" element={<EnrollmentPage />} />
          <Route path ="/attendance/*" element={<AttendancePage />} />
          <Route path="/session/*" element={<SessionPage />} />
          <Route path="/session/:id" element={<SessionDetails />} />
          {/* Add other routes as needed */}
        </Route>
      </Routes>
    </Router>
  );
}