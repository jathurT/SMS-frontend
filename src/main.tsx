import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { DepartmentProvider } from "@/contexts/departmentContext";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { LecturerProvider } from "./contexts/lecturerContext.tsx";
import { StudentProvider } from "./contexts/studentContext.tsx";
import { CourseProvider } from "./contexts/courseContext.tsx";
import { EnrollmentProvider } from "./contexts/enrollmentContext.tsx";
import { AttendanceProvider } from "./contexts/attendanceContext.tsx";
import { SessionProvider } from "./contexts/sessionContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DepartmentProvider>
      <LecturerProvider>
        <StudentProvider>
          <CourseProvider>
            <EnrollmentProvider>
              <SessionProvider>
                <AttendanceProvider>
                  <ThemeProvider>
                    <App />
                  </ThemeProvider>
                </AttendanceProvider>
              </SessionProvider>
            </EnrollmentProvider>
          </CourseProvider>
        </StudentProvider>
      </LecturerProvider>
    </DepartmentProvider>
  </StrictMode>
);
