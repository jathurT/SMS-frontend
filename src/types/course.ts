// Basic Course interface
export interface Course {
  courseId: number;
  courseName: string;
  courseCode: string;
  enrollmentKey?: string;
  credits: number;
  semester: string;
  createdAt: string;
  departmentName: string;
  lecturers?: Lecturer[];
  totalStudentsEnrolled?: number;
}

// Lecturer interface for courses
export interface Lecturer {
  firstName: string;
  lastName: string;
  email: string;
}

// Create course interface
export interface CreateCourse {
  courseName: string;
  courseCode: string;
  enrollmentKey: string;
  credits: number;
  semester: string;
  departmentName: string;
}

// Detailed course information for course details page
export interface CourseDetails {
  courseId: number;
  courseName: string;
  courseCode: string;
  enrollmentKey: string;
  semester: string;
  credits: number;
  departmentName: string;
  lecturers: Array<{
    firstName: string;
    lastName: string;
    email: string;
  }>;
  totalStudentsEnrolled: number;
  createdAt: string;
  enrolledStudents: Array<{
    firstName: string;
    email: string;
    phoneNumber: string;
  }>;
  conductedSessions: Array<{
    sessionId: number;
    date: string;
    startTime: string;
    endTime: string;
    lecturerName: string;
  }>;
  totalSessionsConducted: number;
}