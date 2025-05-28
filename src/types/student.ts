// Add this to your @/types/student.ts file

export interface Student {
    studentId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
}

export interface CreateStudent {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
}

// New interfaces for student details
export interface StudentCourse {
    courseId: number;
    courseName: string;
    courseCode: string;
    semester: string;
}

export interface StudentSession {
    sessionId: number;
    date: string;
    startTime: string;
    endTime: string;
    courseName: string;
    courseCode: string;
    lecturerName: string;
}

export interface StudentDetailsData {
    studentId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    courses: StudentCourse[];
    totalCoursesEnrolled: number;
    sessionsAttended: StudentSession[];
    totalSessionsAttended: number;
}

// New interface for student analytics (array of all students for analytics dashboard)
export interface StudentAnalyticsData {
    studentId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    courses: StudentCourse[];
    totalCoursesEnrolled: number;
    sessionsAttended: StudentSession[];
    totalSessionsAttended: number;
}// Add this to your @/types/student.ts file

export interface Student {
    studentId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
}

export interface CreateStudent {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: Date;
}

// New interfaces for student details
export interface StudentCourse {
    courseId: number;
    courseName: string;
    courseCode: string;
    semester: string;
}

export interface StudentSession {
    sessionId: number;
    date: string;
    startTime: string;
    endTime: string;
    courseName: string;
    courseCode: string;
    lecturerName: string;
}

export interface StudentDetailsData {
    studentId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    courses: StudentCourse[];
    totalCoursesEnrolled: number;
    sessionsAttended: StudentSession[];
    totalSessionsAttended: number;
}