export interface AttendanceRecord {
  studentId: number;
  studentName: string;
  sessionId: number;
  sessionName: string;
  lecturerName: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface NonAttendingStudent {
  studentId: number; // Make sure this is included
  firstName: string;
  email: string;
  phoneNumber: string;
}

export interface AttendanceContextType {
  state: AttendanceState;
  fetchAttendancesBySession: (sessionId: number) => Promise<void>;
  fetchNonAttendingStudents: (sessionId: number) => Promise<void>;
  addAttendance: (sessionId: number, studentId: number) => Promise<void>;
  deleteAttendance: (sessionId: number, studentId: number) => Promise<void>;
  clearData: () => void;
}

export interface AttendanceState {
  attendances: AttendanceRecord[];
  nonAttendingStudents: NonAttendingStudent[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  deleting: boolean;
}