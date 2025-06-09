export interface Session {
  sessionId: number;
  date: string;
  startTime: string;
  endTime: string;
  courseName: string;
  courseCode: string;
  lecturerName: string;
  studentsAttended?: Array<{
    firstName: string;
    email: string;
    phoneNumber: string;
  }>;
}

export interface CreateSessionRequest {
  date: string; // LocalDate format: YYYY-MM-DD
  startTime: string; // LocalTime format: HH:MM:SS
  endTime: string; // LocalTime format: HH:MM:SS
}

export interface UpdateSessionRequest {
  courseId: string;
  lecturerId: string;
  date: string; // LocalDate format: YYYY-MM-DD
  startTime: string; // LocalTime format: HH:MM:SS
  endTime: string; // LocalTime format: HH:MM:SS
}

export interface SessionContextType {
  state: SessionState;
  fetchAllSessions: () => Promise<void>;
  fetchSessionById: (id: number) => Promise<void>;
  fetchSessionsByCourse: (courseId: number) => Promise<void>;
  createSession: (courseId: number, lecturerId: number, request: CreateSessionRequest) => Promise<void>;
  updateSession: (id: number, request: UpdateSessionRequest) => Promise<void>;
  deleteSession: (id: number) => Promise<void>;
  clearSessions: () => void;
  clearCurrentSession: () => void;
}

export interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  loading: boolean;
  currentSessionLoading: boolean;
  error: string | null;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}