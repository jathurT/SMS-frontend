import React, { createContext, useContext, useReducer, useCallback } from 'react';
import axiosInstance from '@/api/axiosInstance';
import { AttendanceRecord, NonAttendingStudent, AttendanceState, AttendanceContextType } from '@/types/attendance';

type AttendanceAction =
  | { type: 'FETCH_ATTENDANCES_START' }
  | { type: 'FETCH_ATTENDANCES_SUCCESS'; payload: AttendanceRecord[] }
  | { type: 'FETCH_ATTENDANCES_ERROR'; payload: string }
  | { type: 'FETCH_NON_ATTENDING_START' }
  | { type: 'FETCH_NON_ATTENDING_SUCCESS'; payload: NonAttendingStudent[] }
  | { type: 'FETCH_NON_ATTENDING_ERROR'; payload: string }
  | { type: 'CREATE_ATTENDANCE_START' }
  | { type: 'CREATE_ATTENDANCE_SUCCESS'; payload: AttendanceRecord }
  | { type: 'CREATE_ATTENDANCE_ERROR'; payload: string }
  | { type: 'DELETE_ATTENDANCE_START' }
  | { type: 'DELETE_ATTENDANCE_SUCCESS'; payload: { sessionId: number; studentId: number } }
  | { type: 'DELETE_ATTENDANCE_ERROR'; payload: string }
  | { type: 'CLEAR_DATA' };

const initialState: AttendanceState = {
  attendances: [],
  nonAttendingStudents: [],
  loading: false,
  error: null,
  creating: false,
  deleting: false,
};

const attendanceReducer = (state: AttendanceState, action: AttendanceAction): AttendanceState => {
  switch (action.type) {
    case 'FETCH_ATTENDANCES_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_ATTENDANCES_SUCCESS':
      return { ...state, loading: false, attendances: action.payload, error: null };
    case 'FETCH_ATTENDANCES_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_NON_ATTENDING_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_NON_ATTENDING_SUCCESS':
      return { ...state, loading: false, nonAttendingStudents: action.payload, error: null };
    case 'FETCH_NON_ATTENDING_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_ATTENDANCE_START':
      return { ...state, creating: true, error: null };
    case 'CREATE_ATTENDANCE_SUCCESS':
      return { 
        ...state, 
        creating: false, 
        attendances: [...state.attendances, action.payload],
        // Remove student from non-attending list when attendance is added
        nonAttendingStudents: state.nonAttendingStudents.filter(s => s.studentId !== action.payload.studentId),
        error: null 
      };
    case 'CREATE_ATTENDANCE_ERROR':
      return { ...state, creating: false, error: action.payload };
    case 'DELETE_ATTENDANCE_START':
      return { ...state, deleting: true, error: null };
    case 'DELETE_ATTENDANCE_SUCCESS':
      return { 
        ...state, 
        deleting: false, 
        attendances: state.attendances.filter(a => 
          !(a.sessionId === action.payload.sessionId && a.studentId === action.payload.studentId)
        ),
        error: null 
      };
    case 'DELETE_ATTENDANCE_ERROR':
      return { ...state, deleting: false, error: action.payload };
    case 'CLEAR_DATA':
      return { ...initialState };
    default:
      return state;
  }
};

// Define the expected response structure to match your backend
interface ApiResponse<T> {
  body: T;
  statusCode: number;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(attendanceReducer, initialState);

  const fetchAttendancesBySession = useCallback(async (sessionId: number) => {
    dispatch({ type: 'FETCH_ATTENDANCES_START' });
    try {
      const response = await axiosInstance.get<ApiResponse<AttendanceRecord[]>>(`/attendances/session/${sessionId}`);
      const attendances = response.data.body || [];
      dispatch({ type: 'FETCH_ATTENDANCES_SUCCESS', payload: attendances });
    } catch (error: any) {
      console.error('Error fetching attendances:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch attendances';
      dispatch({ type: 'FETCH_ATTENDANCES_ERROR', payload: errorMessage });
    }
  }, []);

  const fetchNonAttendingStudents = useCallback(async (sessionId: number) => {
    dispatch({ type: 'FETCH_NON_ATTENDING_START' });
    try {
      const response = await axiosInstance.get<ApiResponse<NonAttendingStudent[]>>(`/attendances/non-attending-students/session/${sessionId}`);
      const students = response.data.body || [];
      console.log('Non-attending students response:', students); // Debug log
      dispatch({ type: 'FETCH_NON_ATTENDING_SUCCESS', payload: students });
    } catch (error: any) {
      console.error('Error fetching non-attending students:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch non-attending students';
      dispatch({ type: 'FETCH_NON_ATTENDING_ERROR', payload: errorMessage });
    }
  }, []);

  const addAttendance = useCallback(async (sessionId: number, studentId: number) => {
    dispatch({ type: 'CREATE_ATTENDANCE_START' });
    try {
      // Send the studentId as a raw number in the request body
      const response = await axiosInstance.post<ApiResponse<AttendanceRecord>>(
        `/attendances/add/session/${sessionId}`, 
        studentId,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const newAttendance = response.data.body;
      dispatch({ type: 'CREATE_ATTENDANCE_SUCCESS', payload: newAttendance });
    } catch (error: any) {
      console.error('Error adding attendance:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add attendance';
      dispatch({ type: 'CREATE_ATTENDANCE_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const deleteAttendance = useCallback(async (sessionId: number, studentId: number) => {
    dispatch({ type: 'DELETE_ATTENDANCE_START' });
    try {
      await axiosInstance.delete(`/attendances/delete/session/${sessionId}/student/${studentId}`);
      dispatch({ type: 'DELETE_ATTENDANCE_SUCCESS', payload: { sessionId, studentId } });
      
      // Refetch non-attending students to update the list after deletion
      await fetchNonAttendingStudents(sessionId);
    } catch (error: any) {
      console.error('Error deleting attendance:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete attendance';
      dispatch({ type: 'DELETE_ATTENDANCE_ERROR', payload: errorMessage });
      throw error;
    }
  }, [fetchNonAttendingStudents]);

  const clearData = useCallback(() => {
    dispatch({ type: 'CLEAR_DATA' });
  }, []);

  const value: AttendanceContextType = {
    state,
    fetchAttendancesBySession,
    fetchNonAttendingStudents,
    addAttendance,
    deleteAttendance,
    clearData,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendanceContext = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendanceContext must be used within an AttendanceProvider');
  }
  return context;
};