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
