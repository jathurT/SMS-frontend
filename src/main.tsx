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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DepartmentProvider>
      <LecturerProvider>
        <StudentProvider>
          <CourseProvider>
            <EnrollmentProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </EnrollmentProvider>
          </CourseProvider>
        </StudentProvider>
      </LecturerProvider>
    </DepartmentProvider>
  </StrictMode>
);
