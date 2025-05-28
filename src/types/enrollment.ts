// types/enrollment.ts
export interface Enrollment {
  enrollmentId: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseName: string;
  courseCode: string;
  enrollmentDate: string;
}

export interface CreateEnrollmentRequest {
  studentId: number;
  enrollmentKey: string;
}

export interface EnrollmentContextType {
  state: {
    enrollments: Enrollment[];
    loading: boolean;
    error: string | null;
    creating: boolean;
    deleting: boolean;
  };
  fetchEnrollmentsByStudentId: (studentId: number) => Promise<void>;
  fetchEnrollmentsByCourseId: (courseId: number) => Promise<void>;
  getAllEnrollments: () => Promise<void>;
  createEnrollment: (courseId: number, request: CreateEnrollmentRequest) => Promise<void>;
  deleteEnrollment: (id: number) => Promise<void>;
  clearEnrollments: () => void;
}