import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import { useEffect } from "react";
import Dashboard from "./pages/dashboard/Dashboard";
import Layout from "./Layout";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DepartmentPage from "./pages/department/DepartmentPage";
import LecturerPage from "./pages/lecturer/LecturerPage";
import LecturerDetails from "./pages/lecturer/LecturerDetails";
import StudentPage from "./pages/student/StudentPage";
import StudentDetails from "./pages/student/StudentDetails";
import CoursePage from "./pages/course/CoursePage";
import CourseDetails from "./pages/course/CourseDetails";
import EnrollmentPage from "./pages/enrollment/EnrollmentPage";
import AttendancePage from "./pages/attendace/AttendancePage";
import SessionPage from "./pages/session/SessionPage";
import SessionDetails from "./pages/session/SessionDetails";
import DepartmentDetailsPage from "./pages/department/DepartmentDetailsPage ";

// Role constants (matching your backend)
const ROLES = {
  ADMIN: 'ADMIN',
  LECTURER: 'LECTURER',
  STUDENT: 'STUDENT'
};

export default function App() {
  const { isAuthenticated, loading, token, user } = useAuth();

  // Debug code - only log when values change
  useEffect(() => {
    console.log('=== AUTH DEBUG ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('loading:', loading);
    console.log('token exists:', !!token);
    console.log('token preview:', token ? token.substring(0, 50) + '...' : 'null');
    console.log('user:', user);
    console.log('==================');
  }, [isAuthenticated, loading, token, user]); // Only run when these values change

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Admin/Department Admin only routes */}
          <Route path="/department/*" element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <DepartmentPage />
            </ProtectedRoute>
          } />
          <Route path="/department/:id" element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <DepartmentDetailsPage />
            </ProtectedRoute>
          } />
          
          {/* Lecturer management - Admin/Department Admin */}
          <Route path="/lecturer/*" element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <LecturerPage />
            </ProtectedRoute>
          } />
          <Route path="/lecturer/:id" element={
            <ProtectedRoute roles={[ROLES.ADMIN, ROLES.LECTURER]}>
              <LecturerDetails />
            </ProtectedRoute>
          } />
          
          {/* Student management */}
          <Route path="/student/*" element={
            <ProtectedRoute roles={[ROLES.ADMIN, ROLES.LECTURER]}>
              <StudentPage />
            </ProtectedRoute>
          } />
          <Route path="/student/:id" element={
            <ProtectedRoute roles={[ROLES.ADMIN, ROLES.LECTURER, ROLES.STUDENT]}>
              <StudentDetails />
            </ProtectedRoute>
          } />
          
          {/* Course management */}
          <Route path="/course/*" element={
            <ProtectedRoute roles={[ROLES.ADMIN,  ROLES.LECTURER]}>
              <CoursePage />
            </ProtectedRoute>
          } />
          <Route path="/course/:id" element={
            <ProtectedRoute roles={[ROLES.ADMIN,  ROLES.LECTURER, ROLES.STUDENT]}>
              <CourseDetails />
            </ProtectedRoute>
          } />
          
          {/* Enrollment management */}
          <Route path="/enrollment/*" element={
            <ProtectedRoute roles={[ROLES.ADMIN,  ROLES.LECTURER, ROLES.STUDENT]}>
              <EnrollmentPage />
            </ProtectedRoute>
          } />
          
          {/* Attendance */}
          <Route path="/attendance/*" element={
            <ProtectedRoute roles={[ROLES.ADMIN,  ROLES.LECTURER, ROLES.STUDENT]}>
              <AttendancePage />
            </ProtectedRoute>
          } />
          
          {/* Session management */}
          <Route path="/session/*" element={
            <ProtectedRoute roles={[ROLES.ADMIN,  ROLES.LECTURER]}>
              <SessionPage />
            </ProtectedRoute>
          } />
          <Route path="/session/:id" element={
            <ProtectedRoute roles={[ROLES.ADMIN,  ROLES.LECTURER, ROLES.STUDENT]}>
              <SessionDetails />
            </ProtectedRoute>
          } />
        </Route>
        
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}