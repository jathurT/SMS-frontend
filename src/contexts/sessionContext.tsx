import React, { createContext, useContext, useReducer, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import { Session, SessionState, SessionContextType, CreateSessionRequest, UpdateSessionRequest } from '@/types/session';

type SessionAction =
  | { type: 'FETCH_SESSIONS_START' }
  | { type: 'FETCH_SESSIONS_SUCCESS'; payload: Session[] }
  | { type: 'FETCH_SESSIONS_ERROR'; payload: string }
  | { type: 'FETCH_SESSION_START' }
  | { type: 'FETCH_SESSION_SUCCESS'; payload: Session }
  | { type: 'FETCH_SESSION_ERROR'; payload: string }
  | { type: 'CREATE_SESSION_START' }
  | { type: 'CREATE_SESSION_SUCCESS'; payload: Session }
  | { type: 'CREATE_SESSION_ERROR'; payload: string }
  | { type: 'UPDATE_SESSION_START' }
  | { type: 'UPDATE_SESSION_SUCCESS'; payload: Session }
  | { type: 'UPDATE_SESSION_ERROR'; payload: string }
  | { type: 'DELETE_SESSION_START' }
  | { type: 'DELETE_SESSION_SUCCESS'; payload: number }
  | { type: 'DELETE_SESSION_ERROR'; payload: string }
  | { type: 'CLEAR_SESSIONS' }
  | { type: 'CLEAR_CURRENT_SESSION' };

const initialState: SessionState = {
  sessions: [],
  currentSession: null,
  loading: false,
  currentSessionLoading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
};

const sessionReducer = (state: SessionState, action: SessionAction): SessionState => {
  switch (action.type) {
    case 'FETCH_SESSIONS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SESSIONS_SUCCESS':
      return { ...state, loading: false, sessions: action.payload, error: null };
    case 'FETCH_SESSIONS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'FETCH_SESSION_START':
      return { ...state, currentSessionLoading: true, error: null };
    case 'FETCH_SESSION_SUCCESS':
      return { ...state, currentSessionLoading: false, currentSession: action.payload, error: null };
    case 'FETCH_SESSION_ERROR':
      return { ...state, currentSessionLoading: false, error: action.payload };
    case 'CREATE_SESSION_START':
      return { ...state, creating: true, error: null };
    case 'CREATE_SESSION_SUCCESS':
      return { 
        ...state, 
        creating: false, 
        sessions: [...state.sessions, action.payload],
        error: null 
      };
    case 'CREATE_SESSION_ERROR':
      return { ...state, creating: false, error: action.payload };
    case 'UPDATE_SESSION_START':
      return { ...state, updating: true, error: null };
    case 'UPDATE_SESSION_SUCCESS':
      return { 
        ...state, 
        updating: false, 
        sessions: state.sessions.map(session => 
          session.sessionId === action.payload.sessionId ? action.payload : session
        ),
        currentSession: state.currentSession?.sessionId === action.payload.sessionId ? action.payload : state.currentSession,
        error: null 
      };
    case 'UPDATE_SESSION_ERROR':
      return { ...state, updating: false, error: action.payload };
    case 'DELETE_SESSION_START':
      return { ...state, deleting: true, error: null };
    case 'DELETE_SESSION_SUCCESS':
      return { 
        ...state, 
        deleting: false, 
        sessions: state.sessions.filter(session => session.sessionId !== action.payload),
        currentSession: state.currentSession?.sessionId === action.payload ? null : state.currentSession,
        error: null 
      };
    case 'DELETE_SESSION_ERROR':
      return { ...state, deleting: false, error: action.payload };
    case 'CLEAR_SESSIONS':
      return { ...state, sessions: [], error: null };
    case 'CLEAR_CURRENT_SESSION':
      return { ...state, currentSession: null, error: null };
    default:
      return state;
  }
};

// Define the expected response structure to match your backend
interface ApiResponse<T> {
  body: T;
  statusCode: number;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const fetchAllSessions = useCallback(async () => {
    dispatch({ type: 'FETCH_SESSIONS_START' });
    try {
      const response = await apiClient.get<ApiResponse<Session[]>>('/sessions/all');
      const sessions = response.data.body || [];
      dispatch({ type: 'FETCH_SESSIONS_SUCCESS', payload: sessions });
    } catch (error: any) {
      console.error('Error fetching all sessions:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch sessions';
      dispatch({ type: 'FETCH_SESSIONS_ERROR', payload: errorMessage });
    }
  }, []);

  const fetchSessionById = useCallback(async (id: number) => {
    dispatch({ type: 'FETCH_SESSION_START' });
    try {
      const response = await apiClient.get<ApiResponse<Session>>(`/sessions/${id}`);
      const session = response.data.body;
      dispatch({ type: 'FETCH_SESSION_SUCCESS', payload: session });
    } catch (error: any) {
      console.error('Error fetching session by ID:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch session';
      dispatch({ type: 'FETCH_SESSION_ERROR', payload: errorMessage });
    }
  }, []);

  const fetchSessionsByCourse = useCallback(async (courseId: number) => {
    dispatch({ type: 'FETCH_SESSIONS_START' });
    try {
      const response = await apiClient.get<ApiResponse<Session[]>>(`/sessions/course/${courseId}`);
      const sessions = response.data.body || [];
      dispatch({ type: 'FETCH_SESSIONS_SUCCESS', payload: sessions });
    } catch (error: any) {
      console.error('Error fetching sessions by course:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch sessions';
      dispatch({ type: 'FETCH_SESSIONS_ERROR', payload: errorMessage });
    }
  }, []);

  const createSession = useCallback(async (courseId: number, lecturerId: number, request: CreateSessionRequest) => {
    dispatch({ type: 'CREATE_SESSION_START' });
    try {
      const response = await apiClient.post<ApiResponse<Session>>(`/sessions/add/course/${courseId}/lecturer/${lecturerId}`, request);
      const newSession = response.data.body;
      dispatch({ type: 'CREATE_SESSION_SUCCESS', payload: newSession });
    } catch (error: any) {
      console.error('Error creating session:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create session';
      dispatch({ type: 'CREATE_SESSION_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const updateSession = useCallback(async (id: number, request: UpdateSessionRequest) => {
    dispatch({ type: 'UPDATE_SESSION_START' });
    try {
      const response = await apiClient.put<ApiResponse<Session>>(`/sessions/update/${id}`, request);
      const updatedSession = response.data.body;
      dispatch({ type: 'UPDATE_SESSION_SUCCESS', payload: updatedSession });
    } catch (error: any) {
      console.error('Error updating session:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update session';
      dispatch({ type: 'UPDATE_SESSION_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const deleteSession = useCallback(async (id: number) => {
    dispatch({ type: 'DELETE_SESSION_START' });
    try {
      await apiClient.delete(`/sessions/delete/${id}`);
      dispatch({ type: 'DELETE_SESSION_SUCCESS', payload: id });
    } catch (error: any) {
      console.error('Error deleting session:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete session';
      dispatch({ type: 'DELETE_SESSION_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const clearSessions = useCallback(() => {
    dispatch({ type: 'CLEAR_SESSIONS' });
  }, []);

  const clearCurrentSession = useCallback(() => {
    dispatch({ type: 'CLEAR_CURRENT_SESSION' });
  }, []);

  const value: SessionContextType = {
    state,
    fetchAllSessions,
    fetchSessionById,
    fetchSessionsByCourse,
    createSession,
    updateSession,
    deleteSession,
    clearSessions,
    clearCurrentSession,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
};
