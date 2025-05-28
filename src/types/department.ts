export interface Department {
    departmentId: number;
    departmentName: string
}
export interface CreateDepartment {
    departmentName: string;
}

export interface Lecturer {
  firstName: string;
  lastName: string;
  email: string;
}

export interface Course {
  courseId: number;
  courseName: string;
  courseCode: string;
  semester: string;
}

export interface DepartmentAnalyticsData {
  departmentId: number;
  departmentName: string;
  lecturers: Lecturer[];
  totalLecturers: number;
  totalCourses: number;
  courses: Course[];
}

export interface DepartmentAnalyticsDetail {
  departmentId: number;
  departmentName: string;
  lecturers: Array<{
    firstName: string;
    lastName: string;
    email: string;
  }>;
  totalLecturers: number;
  totalCourses: number;
  courses: Array<{
    courseId: number;
    courseName: string;
    courseCode: string;
    semester: string;
  }>;
}