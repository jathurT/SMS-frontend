import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from "react";
import axiosInstance from "@/api/axiosInstance";
import {DepartmentAnalyticsData,Department, CreateDepartment } from "@/types/department";

// Updated interfaces to match your API response


// Department API actions
type DepartmentAction =
  | { type: "FETCH_DEPARTMENTS"; payload: Department[] }
  | { type: "FETCH_ANALYTICS"; payload: DepartmentAnalyticsData[] }
  | { type: "CREATE_DEPARTMENT"; payload: Department }
  | { type: "DELETE_DEPARTMENT"; payload: number }
  | { type: "UPDATE_DEPARTMENT"; payload: Department }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ANALYTICS_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ANALYTICS_ERROR"; payload: string | null };

// Department state interface
interface DepartmentState {
  departments: Department[];
  analytics: DepartmentAnalyticsData[];
  loading: boolean;
  analyticsLoading: boolean;
  error: string | null;
  analyticsError: string | null;
}

// Initial state
const initialState: DepartmentState = {
  departments: [],
  analytics: [],
  loading: false,
  analyticsLoading: false,
  error: null,
  analyticsError: null,
};

// Reducer
const departmentReducer = (
  state: DepartmentState,
  action: DepartmentAction
): DepartmentState => {
  switch (action.type) {
    case "FETCH_DEPARTMENTS":
      return { 
        ...state, 
        departments: action.payload, 
        loading: false, 
        error: null 
      };
    case "FETCH_ANALYTICS":
      return {
        ...state,
        analytics: action.payload,
        analyticsLoading: false,
        analyticsError: null
      };
    case "CREATE_DEPARTMENT":
      return { 
        ...state, 
        departments: [...state.departments, action.payload],
        loading: false,
        error: null
      };
    case "DELETE_DEPARTMENT":
      return {
        ...state,
        departments: state.departments.filter(
          (dept) => dept.departmentId !== action.payload
        ),
        loading: false,
        error: null
      };
    case "UPDATE_DEPARTMENT":
      return {
        ...state,
        departments: state.departments.map((dept) =>
          dept.departmentId === action.payload.departmentId ? action.payload : dept
        ),
        loading: false,
        error: null
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload
      };
    case "SET_ANALYTICS_LOADING":
      return {
        ...state,
        analyticsLoading: action.payload
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case "SET_ANALYTICS_ERROR":
      return {
        ...state,
        analyticsError: action.payload,
        analyticsLoading: false
      };
    default:
      return state;
  }
};

// Define the expected response structure from your backend
interface ApiResponse<T> {
  body: T;
  statusCode: number;
}

// Context interface
interface DepartmentContextType {
  state: DepartmentState;
  fetchDepartments: () => Promise<void>;
  fetchDepartmentAnalytics: () => Promise<void>;
  fetchDepartmentById: (id: number) => Promise<Department>;
  createDepartment: (department: CreateDepartment) => Promise<Department>;
  updateDepartment: (id: number, department: CreateDepartment) => Promise<Department>;
  deleteDepartment: (id: number) => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setAnalyticsError: (error: string | null) => void;
  setAnalyticsLoading: (loading: boolean) => void;
}

// Context
export const DepartmentContext = createContext<DepartmentContextType | null>(null);

// Provider component
export const DepartmentProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(departmentReducer, initialState);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setAnalyticsError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ANALYTICS_ERROR", payload: error });
  }, []);

  const setAnalyticsLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_ANALYTICS_LOADING", payload: loading });
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      
      const response = await axiosInstance.get<ApiResponse<Department[]>>('/departments/all');
      
      console.log("Full response:", response.data);
      console.log("Departments from body:", response.data.body);
      
      const departments = response.data.body || [];
      
      if (!Array.isArray(departments)) {
        console.error("Expected array but got:", departments);
        throw new Error("Invalid response format: expected array in body field");
      }
      
      dispatch({ type: "FETCH_DEPARTMENTS", payload: departments });
      
      console.log("Successfully updated state with departments:", departments);
    } catch (error: any) {
      console.error('Error fetching departments:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch departments';
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  }, []);

  const fetchDepartmentAnalytics = useCallback(async () => {
    try {
      dispatch({ type: "SET_ANALYTICS_LOADING", payload: true });
      dispatch({ type: "SET_ANALYTICS_ERROR", payload: null });
      
      const response = await axiosInstance.get<ApiResponse<DepartmentAnalyticsData[]>>('/departments/analytics');
      
      console.log("Analytics response:", response.data);
      console.log("Analytics data from body:", response.data.body);
      
      const analytics = response.data.body || [];
      
      if (!Array.isArray(analytics)) {
        console.error("Expected array but got:", analytics);
        throw new Error("Invalid response format: expected array in body field");
      }
      
      dispatch({ type: "FETCH_ANALYTICS", payload: analytics });
      
      console.log("Successfully updated state with analytics:", analytics);
    } catch (error: any) {
      console.error('Error fetching department analytics:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch department analytics';
      dispatch({ type: "SET_ANALYTICS_ERROR", payload: errorMessage });
    }
  }, []);

  const fetchDepartmentById = useCallback(async (id: number): Promise<Department> => {
    try {
      dispatch({ type: "SET_ERROR", payload: null });
      
      const response = await axiosInstance.get<ApiResponse<Department>>(`/departments/${id}`);
      return response.data.body;
    } catch (error: any) {
      console.error('Error fetching department:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch department';
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  }, []);

  const createDepartment = useCallback(async (department: CreateDepartment): Promise<Department> => {
    try {
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_LOADING", payload: true });
      
      const response = await axiosInstance.post<ApiResponse<Department>>('/departments/add', department);
      const newDepartment = response.data.body;
      
      dispatch({ type: "CREATE_DEPARTMENT", payload: newDepartment });

      return newDepartment;
    } catch (error: any) {
      console.error('Error creating department:', error);
      
      // Enhanced error handling with better error extraction
      let errorMessage = 'Failed to create department';
      
      if (error.response?.data) {
        if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  }, []);

  const updateDepartment = useCallback(async (id: number, department: CreateDepartment): Promise<Department> => {
    try {
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_LOADING", payload: true });
      
      const response = await axiosInstance.put<ApiResponse<Department>>(`/departments/update/${id}`, department);
      const updatedDepartment = response.data.body;
      
      dispatch({ type: "UPDATE_DEPARTMENT", payload: updatedDepartment });

      return updatedDepartment;
    } catch (error: any) {
      console.error('Error updating department:', error);
      
      let errorMessage = 'Failed to update department';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  }, []);

  const deleteDepartment = useCallback(async (id: number): Promise<void> => {
    try {
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_LOADING", payload: true });
      
      await axiosInstance.delete(`/departments/delete/${id}`);
      
      dispatch({ type: "DELETE_DEPARTMENT", payload: id });
    } catch (error: any) {
      console.error('Error deleting department:', error);
      
      let errorMessage = 'Failed to delete department';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  }, []);

  // Auto-fetch departments on mount
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return (
    <DepartmentContext.Provider
      value={{
        state,
        fetchDepartments,
        fetchDepartmentAnalytics,
        fetchDepartmentById,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        setError,
        setLoading,
        setAnalyticsError,
        setAnalyticsLoading,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};

// Custom hook to use Department context
export const useDepartmentContext = () => {
  const context = useContext(DepartmentContext);
  if (!context) {
    throw new Error("useDepartmentContext must be used within a DepartmentProvider");
  }
  return context;
};