import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import apiClient from '../utils/apiClient';
import {
  LecturerAnalyticsData,
  Lecturer,
  CreateLecturer,
  LecturerDetailsData,
  Course,
} from "@/types/lecturer";

// Define the detailed lecturer response structure

// Lecturer API actions
type LecturerAction =
  | { type: "FETCH_LECTURERS"; payload: Lecturer[] }
  | { type: "FETCH_ANALYTICS"; payload: LecturerAnalyticsData[] }
  | { type: "FETCH_LECTURER_DETAILS"; payload: LecturerDetailsData }
  | { type: "CREATE_LECTURER"; payload: Lecturer }
  | { type: "DELETE_LECTURER"; payload: number }
  | { type: "UPDATE_LECTURER"; payload: Lecturer }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ANALYTICS_LOADING"; payload: boolean }
  | { type: "SET_DETAILS_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ANALYTICS_ERROR"; payload: string | null }
  | { type: "SET_DETAILS_ERROR"; payload: string | null };

// Lecturer state interface
interface LecturerState {
  lecturers: Lecturer[];
  analytics: LecturerAnalyticsData[];
  lecturerDetails: LecturerDetailsData | null;
  loading: boolean;
  analyticsLoading: boolean;
  detailsLoading: boolean;
  error: string | null;
  analyticsError: string | null;
  detailsError: string | null;
}

// Initial state
const initialState: LecturerState = {
  lecturers: [],
  analytics: [],
  lecturerDetails: null,
  loading: false,
  analyticsLoading: false,
  detailsLoading: false,
  error: null,
  analyticsError: null,
  detailsError: null,
};

// Reducer
const lecturerReducer = (
  state: LecturerState,
  action: LecturerAction
): LecturerState => {
  switch (action.type) {
    case "FETCH_LECTURERS":
      return {
        ...state,
        lecturers: action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_ANALYTICS":
      return {
        ...state,
        analytics: action.payload,
        analyticsLoading: false,
        analyticsError: null,
      };
    case "FETCH_LECTURER_DETAILS":
      return {
        ...state,
        lecturerDetails: action.payload,
        detailsLoading: false,
        detailsError: null,
      };
    case "CREATE_LECTURER":
      return {
        ...state,
        lecturers: [...state.lecturers, action.payload],
        loading: false,
        error: null,
      };
    case "DELETE_LECTURER":
      return {
        ...state,
        lecturers: state.lecturers.filter(
          (lecturer) => lecturer.lecturerId !== action.payload
        ),
        loading: false,
        error: null,
      };
    case "UPDATE_LECTURER":
      return {
        ...state,
        lecturers: state.lecturers.map((lecturer) =>
          lecturer.lecturerId === action.payload.lecturerId
            ? action.payload
            : lecturer
        ),
        loading: false,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ANALYTICS_LOADING":
      return {
        ...state,
        analyticsLoading: action.payload,
      };
    case "SET_DETAILS_LOADING":
      return {
        ...state,
        detailsLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "SET_ANALYTICS_ERROR":
      return {
        ...state,
        analyticsError: action.payload,
        analyticsLoading: false,
      };
    case "SET_DETAILS_ERROR":
      return {
        ...state,
        detailsError: action.payload,
        detailsLoading: false,
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
interface LecturerContextType {
  state: LecturerState;
  fetchLecturers: () => Promise<void>;
  fetchLecturerAnalytics: () => Promise<void>;
  fetchLecturerById: (id: number) => Promise<Lecturer>;
  fetchLecturerDetails: (id: number) => Promise<LecturerDetailsData>;
  createLecturer: (lecturer: CreateLecturer) => Promise<Lecturer>;
  updateLecturer: (id: number, lecturer: CreateLecturer) => Promise<Lecturer>;
  deleteLecturer: (id: number) => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setAnalyticsError: (error: string | null) => void;
  setAnalyticsLoading: (loading: boolean) => void;
  setDetailsError: (error: string | null) => void;
  setDetailsLoading: (loading: boolean) => void;
}

// Context
export const LecturerContext = createContext<LecturerContextType | null>(null);

// Provider component
export const LecturerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(lecturerReducer, initialState);

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

  const setDetailsError = useCallback((error: string | null) => {
    dispatch({ type: "SET_DETAILS_ERROR", payload: error });
  }, []);

  const setDetailsLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_DETAILS_LOADING", payload: loading });
  }, []);

  const fetchLecturers = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const response = await apiClient.get<ApiResponse<Lecturer[]>>(
        "/lecturers/all"
      );

      console.log("Full response:", response.data);
      console.log("Lecturers from body:", response.data.body);

      const lecturers = response.data.body || [];

      if (!Array.isArray(lecturers)) {
        console.error("Expected array but got:", lecturers);
        throw new Error(
          "Invalid response format: expected array in body field"
        );
      }

      dispatch({ type: "FETCH_LECTURERS", payload: lecturers });

      console.log("Successfully updated state with lecturers:", lecturers);
    } catch (error: any) {
      console.error("Error fetching lecturers:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch lecturers";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  }, []);

  const fetchLecturerAnalytics = useCallback(async () => {
    try {
      dispatch({ type: "SET_ANALYTICS_LOADING", payload: true });
      dispatch({ type: "SET_ANALYTICS_ERROR", payload: null });

      const response = await apiClient.get<
        ApiResponse<LecturerAnalyticsData[]>
      >("/lecturers/analytics");

      console.log("Analytics response:", response.data);
      console.log("Analytics data from body:", response.data.body);

      const analytics = response.data.body || [];

      if (!Array.isArray(analytics)) {
        console.error("Expected array but got:", analytics);
        throw new Error(
          "Invalid response format: expected array in body field"
        );
      }

      dispatch({ type: "FETCH_ANALYTICS", payload: analytics });

      console.log("Successfully updated state with analytics:", analytics);
    } catch (error: any) {
      console.error("Error fetching lecturer analytics:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch lecturer analytics";
      dispatch({ type: "SET_ANALYTICS_ERROR", payload: errorMessage });
    }
  }, []);

  const fetchLecturerById = useCallback(
    async (id: number): Promise<Lecturer> => {
      try {
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiClient.get<ApiResponse<Lecturer>>(
          `/lecturers/${id}`
        );
        return response.data.body;
      } catch (error: any) {
        console.error("Error fetching lecturer:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch lecturer";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      }
    },
    []
  );

  // New method to fetch detailed lecturer information
  const fetchLecturerDetails = useCallback(
    async (id: number): Promise<LecturerDetailsData> => {
      try {
        dispatch({ type: "SET_DETAILS_LOADING", payload: true });
        dispatch({ type: "SET_DETAILS_ERROR", payload: null });

        const response = await apiClient.get<
          ApiResponse<LecturerDetailsData>
        >(`/lecturers/details/${id}`);

        console.log("Lecturer details response:", response.data);
        console.log("Lecturer details from body:", response.data.body);

        const lecturerDetails = response.data.body;

        if (!lecturerDetails) {
          throw new Error("Invalid response format: no data in body field");
        }

        dispatch({ type: "FETCH_LECTURER_DETAILS", payload: lecturerDetails });

        console.log(
          "Successfully updated state with lecturer details:",
          lecturerDetails
        );
        return lecturerDetails;
      } catch (error: any) {
        console.error("Error fetching lecturer details:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch lecturer details";
        dispatch({ type: "SET_DETAILS_ERROR", payload: errorMessage });
        throw error;
      }
    },
    []
  );

  const createLecturer = useCallback(
    async (lecturer: CreateLecturer): Promise<Lecturer> => {
      try {
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_LOADING", payload: true });

        const response = await apiClient.post<ApiResponse<Lecturer>>(
          "/lecturers/add",
          lecturer
        );
        const newLecturer = response.data.body;

        dispatch({ type: "CREATE_LECTURER", payload: newLecturer });

        return newLecturer;
      } catch (error: any) {
        console.error("Error creating lecturer:", error);

        // Enhanced error handling with better error extraction
        let errorMessage = "Failed to create lecturer";

        if (error.response?.data) {
          if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (typeof error.response.data === "string") {
            errorMessage = error.response.data;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      }
    },
    []
  );

  const updateLecturer = useCallback(
    async (id: number, lecturer: CreateLecturer): Promise<Lecturer> => {
      try {
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_LOADING", payload: true });

        const response = await apiClient.put<ApiResponse<Lecturer>>(
          `/lecturers/update/${id}`,
          lecturer
        );
        const updatedLecturer = response.data.body;

        dispatch({ type: "UPDATE_LECTURER", payload: updatedLecturer });

        return updatedLecturer;
      } catch (error: any) {
        console.error("Error updating lecturer:", error);

        let errorMessage = "Failed to update lecturer";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      }
    },
    []
  );

  const deleteLecturer = useCallback(async (id: number): Promise<void> => {
    try {
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_LOADING", payload: true });

      await apiClient.delete(`/lecturers/delete/${id}`);

      dispatch({ type: "DELETE_LECTURER", payload: id });
    } catch (error: any) {
      console.error("Error deleting lecturer:", error);

      let errorMessage = "Failed to delete lecturer";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  }, []);

  // Auto-fetch lecturers on mount
  useEffect(() => {
    fetchLecturers();
  }, [fetchLecturers]);

  return (
    <LecturerContext.Provider
      value={{
        state,
        fetchLecturers,
        fetchLecturerAnalytics,
        fetchLecturerById,
        fetchLecturerDetails,
        createLecturer,
        updateLecturer,
        deleteLecturer,
        setError,
        setLoading,
        setAnalyticsError,
        setAnalyticsLoading,
        setDetailsError,
        setDetailsLoading,
      }}
    >
      {children}
    </LecturerContext.Provider>
  );
};

// Custom hook to use Lecturer context
export const useLecturerContext = () => {
  const context = useContext(LecturerContext);
  if (!context) {
    throw new Error(
      "useLecturerContext must be used within a LecturerProvider"
    );
  }
  return context;
};

// Export types for use in components
export type { LecturerDetailsData, Course };
