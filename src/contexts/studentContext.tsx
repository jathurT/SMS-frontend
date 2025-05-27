import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "@/api/axiosInstance";
import {
  Student,
  CreateStudent,
  StudentDetailsData,
  StudentAnalyticsData,
} from "@/types/student";

// Student API actions
type StudentAction =
  | { type: "FETCH_STUDENTS"; payload: Student[] }
  | { type: "FETCH_STUDENT_BY_EMAIL"; payload: Student }
  | { type: "FETCH_STUDENT_DETAILS"; payload: StudentDetailsData }
  | { type: "FETCH_ANALYTICS"; payload: StudentAnalyticsData[] }
  | { type: "CREATE_STUDENT"; payload: Student }
  | { type: "DELETE_STUDENT"; payload: number }
  | { type: "UPDATE_STUDENT"; payload: Student }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_DETAILS_LOADING"; payload: boolean }
  | { type: "SET_ANALYTICS_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_DETAILS_ERROR"; payload: string | null }
  | { type: "SET_ANALYTICS_ERROR"; payload: string | null };

// Student state interface
interface StudentState {
  students: Student[];
  studentDetails: StudentDetailsData | null;
  analytics: StudentAnalyticsData[];
  loading: boolean;
  detailsLoading: boolean;
  analyticsLoading: boolean;
  error: string | null;
  detailsError: string | null;
  analyticsError: string | null;
}

// Initial state
const initialState: StudentState = {
  students: [],
  studentDetails: null,
  analytics: [],
  loading: false,
  detailsLoading: false,
  analyticsLoading: false,
  error: null,
  detailsError: null,
  analyticsError: null,
};

// Reducer
const studentReducer = (
  state: StudentState,
  action: StudentAction
): StudentState => {
  switch (action.type) {
    case "FETCH_STUDENTS":
      return {
        ...state,
        students: action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_STUDENT_BY_EMAIL":
      return {
        ...state,
        loading: false,
        error: null,
      };
    case "FETCH_STUDENT_DETAILS":
      return {
        ...state,
        studentDetails: action.payload,
        detailsLoading: false,
        detailsError: null,
      };
    case "FETCH_ANALYTICS":
      return {
        ...state,
        analytics: action.payload,
        analyticsLoading: false,
        analyticsError: null,
      };
    case "CREATE_STUDENT":
      return {
        ...state,
        students: [...state.students, action.payload],
        loading: false,
        error: null,
      };
    case "DELETE_STUDENT":
      return {
        ...state,
        students: state.students.filter(
          (student) => student.studentId !== action.payload
        ),
        loading: false,
        error: null,
      };
    case "UPDATE_STUDENT":
      return {
        ...state,
        students: state.students.map((student) =>
          student.studentId === action.payload.studentId
            ? action.payload
            : student
        ),
        loading: false,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_DETAILS_LOADING":
      return {
        ...state,
        detailsLoading: action.payload,
      };
    case "SET_ANALYTICS_LOADING":
      return {
        ...state,
        analyticsLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "SET_DETAILS_ERROR":
      return {
        ...state,
        detailsError: action.payload,
        detailsLoading: false,
      };
    case "SET_ANALYTICS_ERROR":
      return {
        ...state,
        analyticsError: action.payload,
        analyticsLoading: false,
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
interface StudentContextType {
  state: StudentState;
  fetchStudents: () => Promise<void>;
  fetchStudentById: (id: number) => Promise<Student>;
  fetchStudentByEmail: (email: string) => Promise<Student>;
  fetchStudentDetails: (id: number) => Promise<StudentDetailsData>;
  fetchStudentAnalytics: () => Promise<void>;
  createStudent: (student: CreateStudent) => Promise<Student>;
  updateStudent: (id: number, student: CreateStudent) => Promise<Student>;
  deleteStudent: (id: number) => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setDetailsError: (error: string | null) => void;
  setDetailsLoading: (loading: boolean) => void;
  setAnalyticsError: (error: string | null) => void;
  setAnalyticsLoading: (loading: boolean) => void;
}

// Context
export const StudentContext = createContext<StudentContextType | null>(null);

// Provider component
export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(studentReducer, initialState);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setDetailsError = useCallback((error: string | null) => {
    dispatch({ type: "SET_DETAILS_ERROR", payload: error });
  }, []);

  const setDetailsLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_DETAILS_LOADING", payload: loading });
  }, []);

  const setAnalyticsError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ANALYTICS_ERROR", payload: error });
  }, []);

  const setAnalyticsLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_ANALYTICS_LOADING", payload: loading });
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const response = await axiosInstance.get<ApiResponse<Student[]>>(
        "/students/all"
      );

      console.log("Full response:", response.data);
      console.log("Students from body:", response.data.body);

      const students = response.data.body || [];

      if (!Array.isArray(students)) {
        console.error("Expected array but got:", students);
        throw new Error(
          "Invalid response format: expected array in body field"
        );
      }

      dispatch({ type: "FETCH_STUDENTS", payload: students });

      console.log("Successfully updated state with students:", students);
    } catch (error: any) {
      console.error("Error fetching students:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch students";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  }, []);

  const fetchStudentById = useCallback(
    async (id: number): Promise<Student> => {
      try {
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await axiosInstance.get<ApiResponse<Student>>(
          `/students/${id}`
        );
        return response.data.body;
      } catch (error: any) {
        console.error("Error fetching student:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch student";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      }
    },
    []
  );

  const fetchStudentDetails = useCallback(
    async (id: number): Promise<StudentDetailsData> => {
      try {
        dispatch({ type: "SET_DETAILS_LOADING", payload: true });
        dispatch({ type: "SET_DETAILS_ERROR", payload: null });

        const response = await axiosInstance.get<ApiResponse<StudentDetailsData>>(
          `/students/details/${id}`
        );

        console.log("Student details response:", response.data);
        console.log("Student details from body:", response.data.body);

        const studentDetails = response.data.body;

        if (!studentDetails) {
          throw new Error("Invalid response format: no data in body field");
        }

        dispatch({ type: "FETCH_STUDENT_DETAILS", payload: studentDetails });

        console.log(
          "Successfully updated state with student details:",
          studentDetails
        );
        return studentDetails;
      } catch (error: any) {
        console.error("Error fetching student details:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch student details";
        dispatch({ type: "SET_DETAILS_ERROR", payload: errorMessage });
        throw error;
      }
    },
    []
  );

  const fetchStudentAnalytics = useCallback(async () => {
    try {
      dispatch({ type: "SET_ANALYTICS_LOADING", payload: true });
      dispatch({ type: "SET_ANALYTICS_ERROR", payload: null });

      const response = await axiosInstance.get<ApiResponse<StudentAnalyticsData[]>>(
        "/students/analytics"
      );

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
      console.error("Error fetching student analytics:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch student analytics";
      dispatch({ type: "SET_ANALYTICS_ERROR", payload: errorMessage });
    }
  }, []);

  const fetchStudentByEmail = useCallback(
    async (email: string): Promise<Student> => {
      try {
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await axiosInstance.get<ApiResponse<Student>>(
          `/students/email/${encodeURIComponent(email)}`
        );
        
        const student = response.data.body;
        dispatch({ type: "FETCH_STUDENT_BY_EMAIL", payload: student });
        
        return student;
      } catch (error: any) {
        console.error("Error fetching student by email:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch student by email";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      }
    },
    []
  );

  const createStudent = useCallback(
    async (student: CreateStudent): Promise<Student> => {
      try {
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_LOADING", payload: true });

        const response = await axiosInstance.post<ApiResponse<Student>>(
          "/students/add",
          student
        );
        const newStudent = response.data.body;

        dispatch({ type: "CREATE_STUDENT", payload: newStudent });

        return newStudent;
      } catch (error: any) {
        console.error("Error creating student:", error);

        // Enhanced error handling with better error extraction
        let errorMessage = "Failed to create student";

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

  const updateStudent = useCallback(
    async (id: number, student: CreateStudent): Promise<Student> => {
      try {
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_LOADING", payload: true });

        const response = await axiosInstance.put<ApiResponse<Student>>(
          `/students/update/${id}`,
          student
        );
        const updatedStudent = response.data.body;

        dispatch({ type: "UPDATE_STUDENT", payload: updatedStudent });

        return updatedStudent;
      } catch (error: any) {
        console.error("Error updating student:", error);

        let errorMessage = "Failed to update student";
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

  const deleteStudent = useCallback(async (id: number): Promise<void> => {
    try {
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_LOADING", payload: true });

      await axiosInstance.delete(`/students/delete/${id}`);

      dispatch({ type: "DELETE_STUDENT", payload: id });
    } catch (error: any) {
      console.error("Error deleting student:", error);

      let errorMessage = "Failed to delete student";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  }, []);

  // Auto-fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <StudentContext.Provider
      value={{
        state,
        fetchStudents,
        fetchStudentById,
        fetchStudentByEmail,
        fetchStudentDetails,
        fetchStudentAnalytics,
        createStudent,
        updateStudent,
        deleteStudent,
        setError,
        setLoading,
        setDetailsError,
        setDetailsLoading,
        setAnalyticsError,
        setAnalyticsLoading,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

// Custom hook to use Student context
export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error(
      "useStudentContext must be used within a StudentProvider"
    );
  }
  return context;
};