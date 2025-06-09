// contexts/enrollmentContext.tsx
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { Enrollment, CreateEnrollmentRequest, EnrollmentContextType } from '@/types/enrollment';

type EnrollmentState = {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
  creating: boolean;
  deleting: boolean;
};

type EnrollmentAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Enrollment[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'CREATE_START' }
  | { type: 'CREATE_SUCCESS'; payload: Enrollment }
  | { type: 'CREATE_ERROR'; payload: string }
  | { type: 'DELETE_START' }
  | { type: 'DELETE_SUCCESS'; payload: number }
  | { type: 'DELETE_ERROR'; payload: string }
  | { type: 'CLEAR_ENROLLMENTS' };

const initialState: EnrollmentState = {
  enrollments: [],
  loading: false,
  error: null,
  creating: false,
  deleting: false,
};

const enrollmentReducer = (state: EnrollmentState, action: EnrollmentAction): EnrollmentState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, enrollments: action.payload, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_START':
      return { ...state, creating: true, error: null };
    case 'CREATE_SUCCESS':
      return { 
        ...state, 
        creating: false, 
        enrollments: [...state.enrollments, action.payload],
        error: null 
      };
    case 'CREATE_ERROR':
      return { ...state, creating: false, error: action.payload };
    case 'DELETE_START':
      return { ...state, deleting: true, error: null };
    case 'DELETE_SUCCESS':
      return { 
        ...state, 
        deleting: false, 
        enrollments: state.enrollments.filter(e => e.enrollmentId !== action.payload),
        error: null 
      };
    case 'DELETE_ERROR':
      return { ...state, deleting: false, error: action.payload };
    case 'CLEAR_ENROLLMENTS':
      return { ...state, enrollments: [], error: null };
    default:
      return state;
  }
};

// Define the expected response structure to match your backend
interface ApiResponse<T> {
  body: T;
  statusCode: number;
}

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

export const EnrollmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(enrollmentReducer, initialState);

  const fetchEnrollmentsByStudentId = useCallback(async (studentId: number) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await apiClient.get<ApiResponse<Enrollment[]>>(`/enrollments/student/${studentId}`);
      const enrollments = response.data.body || [];
      dispatch({ type: 'FETCH_SUCCESS', payload: enrollments });
    } catch (error: any) {
      console.error('Error fetching enrollments by student:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch enrollments';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
    }
  }, []);

  const fetchEnrollmentsByCourseId = useCallback(async (courseId: number) => {
    dispatch({ type: 'FETCH_START' });
    try {
      // Try with the exact working path from your test
      const response = await apiClient.get<ApiResponse<Enrollment[]>>(`/enrollments/course/${courseId}`);
      const enrollments = response.data.body || [];
      dispatch({ type: 'FETCH_SUCCESS', payload: enrollments });
    } catch (error: any) {
      console.error('Error fetching enrollments by course:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch enrollments';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
    }
  }, []);

  const getAllEnrollments = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const response = await apiClient.get<ApiResponse<Enrollment[]>>('/enrollments/all');
      const enrollments = response.data.body || [];
      dispatch({ type: 'FETCH_SUCCESS', payload: enrollments });
    } catch (error: any) {
      console.error('Error fetching all enrollments:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch enrollments';
      dispatch({ type: 'FETCH_ERROR', payload: errorMessage });
    }
  }, []);

  const createEnrollment = useCallback(async (courseId: number, request: CreateEnrollmentRequest) => {
    dispatch({ type: 'CREATE_START' });
    try {
      const response = await apiClient.post<ApiResponse<Enrollment>>(`/enrollments/${courseId}`, request);
      const newEnrollment = response.data.body;
      dispatch({ type: 'CREATE_SUCCESS', payload: newEnrollment });
    } catch (error: any) {
      console.error('Error creating enrollment:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create enrollment';
      dispatch({ type: 'CREATE_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const deleteEnrollment = useCallback(async (id: number) => {
    dispatch({ type: 'DELETE_START' });
    try {
      await apiClient.delete(`/enrollments/delete/${id}`);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
    } catch (error: any) {
      console.error('Error deleting enrollment:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete enrollment';
      dispatch({ type: 'DELETE_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const clearEnrollments = useCallback(() => {
    dispatch({ type: 'CLEAR_ENROLLMENTS' });
  }, []);

  const value: EnrollmentContextType = {
    state,
    fetchEnrollmentsByStudentId,
    fetchEnrollmentsByCourseId,
    getAllEnrollments,
    createEnrollment,
    deleteEnrollment,
    clearEnrollments,
  };

  return (
    <EnrollmentContext.Provider value={value}>
      {children}
    </EnrollmentContext.Provider>
  );
};

export const useEnrollmentContext = () => {
  const context = useContext(EnrollmentContext);
  if (context === undefined) {
    throw new Error('useEnrollmentContext must be used within an EnrollmentProvider');
  }
  return context;
};