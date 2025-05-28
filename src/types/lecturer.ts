export interface Lecturer {
    lecturerId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    departmentId: number;
    address?: string;
    dateOfBirth: Date;
}
export interface CreateLecturer {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string; 
    departmentId: number; 
    address?: string; 
    dateOfBirth: Date
}

export interface LecturerAnalyticsData {
    lecturerId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    departmentId: number;
    address?: string;
    dateOfBirth: Date;
    totalCoursesTaught: number; // Total number of courses taught by the lecturer
    totalSessionsConducted: number; // Total number of sessions conducted by the lecturer
}
export interface Course {
  courseId: number;
  courseName: string;
  courseCode: string;
  semester: string;
}

export interface LecturerDetailsData {
  lecturerId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  address: string;
  departmentName: string;
  courses: Course[];
}