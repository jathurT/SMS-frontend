import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import axiosInstance from "@/api/axiosInstance";
import { Course, CreateCourse, CourseDetails } from "@/types/course";

// Course analytics interface based on your API response

// Course API actions
type CourseAction =
  | { type: "FETCH_COURSES"; payload: Course[] }
  | { type: "FETCH_COURSE_ANALYTICS"; payload: CourseDetails[] }
  | { type: "FETCH_COURSE_DETAILS"; payload: CourseDetails }
  | { type: "CREATE_COURSE"; payload: Course }
  | { type: "DELETE_COURSE"; payload: number }
  | { type: "UPDATE_COURSE"; payload: Course }
  | { type: "ADD_LECTURER_TO_COURSE"; payload: Course }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ANALYTICS_LOADING"; payload: boolean }
  | { type: "SET_DETAILS_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_ANALYTICS_ERROR"; payload: string | null }
  | { type: "SET_DETAILS_ERROR"; payload: string | null }
  | { type: "FETCH_COURSES_BY_DEPARTMENT"; payload: Course[] }
  | { type: "CLEAR_COURSES" };

// Course state interface
interface CourseState {
  courses: Course[];
  analytics: CourseDetails[];
  courseDetails: CourseDetails | null;
  loading: boolean;
  analyticsLoading: boolean;
  detailsLoading: boolean;
  error: string | null;
  analyticsError: string | null;
  detailsError: string | null;
}

// Initial state
const initialState: CourseState = {
  courses: [],
  analytics: [],
  courseDetails: null,
  loading: false,
  analyticsLoading: false,
  detailsLoading: false,
  error: null,
  analyticsError: null,
  detailsError: null,
};

// Reducer
const courseReducer = (
  state: CourseState,
  action: CourseAction
): CourseState => {
  switch (action.type) {
    case "FETCH_COURSES":
      return {
        ...state,
        courses: action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_COURSE_ANALYTICS":
      return {
        ...state,
        analytics: action.payload,
        analyticsLoading: false,
        analyticsError: null,
      };
    case "FETCH_COURSE_DETAILS":
      return {
        ...state,
        courseDetails: action.payload,
        detailsLoading: false,
        detailsError: null,
      };
    case "CREATE_COURSE":
      return {
        ...state,
        courses: [...state.courses, action.payload],
        loading: false,
        error: null,
      };
    case "DELETE_COURSE":
      return {
        ...state,
        courses: state.courses.filter(
          (course) => course.courseId !== action.payload
        ),
        loading: false,
        error: null,
      };
    case "UPDATE_COURSE":
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.courseId === action.payload.courseId ? action.payload : course
        ),
        loading: false,
        error: null,
      };
    case "ADD_LECTURER_TO_COURSE":
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.courseId === action.payload.courseId ? action.payload : course
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
    case "FETCH_COURSES_BY_DEPARTMENT":
      return {
        ...state,
        courses: action.payload,
        loading: false,
        error: null,
      };
    case "CLEAR_COURSES":
      return {
        ...state,
        courses: [],
        error: null,
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
interface CourseContextType {
  state: CourseState;
  fetchCourses: () => Promise<void>;
  fetchCourseAnalytics: () => Promise<void>;
  fetchCourseById: (id: number) => Promise<Course>;
  fetchCourseDetails: (id: number) => Promise<CourseDetails>;
  createCourse: (course: CreateCourse) => Promise<Course>;
  updateCourse: (id: number, course: CreateCourse) => Promise<Course>;
  deleteCourse: (id: number) => Promise<void>;
  addLecturerToCourse: (
    courseId: number,
    lecturerId: number
  ) => Promise<Course>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setAnalyticsError: (error: string | null) => void;
  setAnalyticsLoading: (loading: boolean) => void;
  setDetailsError: (error: string | null) => void;
  setDetailsLoading: (loading: boolean) => void;
  fetchCoursesByDepartment: (departmentId: number) => Promise<void>;
  clearCourses: () => void;
}

// Context
export const CourseContext = createContext<CourseContextType | null>(null);

// Provider component
export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(courseReducer, initialState);

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

  const fetchCourses = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const response = await axiosInstance.get<ApiResponse<Course[]>>(
        "/courses/all"
      );

      console.log("Full response:", response.data);
      console.log("Courses from body:", response.data.body);

      const courses = response.data.body || [];

      if (!Array.isArray(courses)) {
        console.error("Expected array but got:", courses);
        throw new Error(
          "Invalid response format: expected array in body field"
        );
      }

      dispatch({ type: "FETCH_COURSES", payload: courses });

      console.log("Successfully updated state with courses:", courses);
    } catch (error: any) {
      console.error("Error fetching courses:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch courses";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  }, []);

  // NEW METHOD: Fetch course analytics data
  const fetchCourseAnalytics = useCallback(async () => {
    try {
      dispatch({ type: "SET_ANALYTICS_LOADING", payload: true });
      dispatch({ type: "SET_ANALYTICS_ERROR", payload: null });

      const response = await axiosInstance.get<ApiResponse<CourseDetails[]>>(
        "/courses/analytics"
      );

      console.log("Course analytics response:", response.data);
      console.log("Analytics from body:", response.data.body);

      const analytics = response.data.body || [];

      if (!Array.isArray(analytics)) {
        console.error("Expected array but got:", analytics);
        throw new Error(
          "Invalid response format: expected array in body field"
        );
      }

      dispatch({ type: "FETCH_COURSE_ANALYTICS", payload: analytics });

      console.log(
        "Successfully updated state with course analytics:",
        analytics
      );
    } catch (error: any) {
      console.error("Error fetching course analytics:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch course analytics";
      dispatch({ type: "SET_ANALYTICS_ERROR", payload: errorMessage });
    }
  }, []);

  const fetchCourseById = useCallback(async (id: number): Promise<Course> => {
    try {
      dispatch({ type: "SET_DETAILS_LOADING", payload: true });
      dispatch({ type: "SET_DETAILS_ERROR", payload: null });

      const response = await axiosInstance.get<ApiResponse<Course>>(
        `/courses/${id}`
      );

      console.log("Course details response:", response.data);
      console.log("Course details from body:", response.data.body);

      const courseDetails = response.data.body;

      if (!courseDetails) {
        throw new Error("Invalid response format: no data in body field");
      }

      return courseDetails;
    } catch (error: any) {
      console.error("Error fetching course:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch course";
      dispatch({ type: "SET_DETAILS_ERROR", payload: errorMessage });
      throw error;
    }
  }, []);

  const fetchCourseDetails = useCallback(
    async (id: number): Promise<CourseDetails> => {
      try {
        dispatch({ type: "SET_DETAILS_LOADING", payload: true });
        dispatch({ type: "SET_DETAILS_ERROR", payload: null });

        const response = await axiosInstance.get<ApiResponse<CourseDetails>>(
          `/courses/details/${id}`
        );

        console.log("Course details response:", response.data);
        console.log("Course details from body:", response.data.body);

        const courseDetails = response.data.body;

        if (!courseDetails) {
          throw new Error("Invalid response format: no data in body field");
        }

        dispatch({ type: "FETCH_COURSE_DETAILS", payload: courseDetails });

        console.log(
          "Successfully updated state with course details:",
          courseDetails
        );
        return courseDetails;
      } catch (error: any) {
        console.error("Error fetching course details:", error);
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch course details";
        dispatch({ type: "SET_DETAILS_ERROR", payload: errorMessage });
        throw error;
      }
    },
    []
  );

  const createCourse = useCallback(
    async (course: CreateCourse): Promise<Course> => {
      try {
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_LOADING", payload: true });

        const response = await axiosInstance.post<ApiResponse<Course>>(
          "/courses/add",
          course
        );
        const newCourse = response.data.body;

        dispatch({ type: "CREATE_COURSE", payload: newCourse });

        return newCourse;
      } catch (error: any) {
        console.error("Error creating course:", error);

        // Enhanced error handling with better error extraction
        let errorMessage = "Failed to create course";

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

  const updateCourse = useCallback(
    async (id: number, course: CreateCourse): Promise<Course> => {
      try {
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_LOADING", payload: true });

        const response = await axiosInstance.put<ApiResponse<Course>>(
          `/courses/update/${id}`,
          course
        );
        const updatedCourse = response.data.body;

        dispatch({ type: "UPDATE_COURSE", payload: updatedCourse });

        return updatedCourse;
      } catch (error: any) {
        console.error("Error updating course:", error);

        let errorMessage = "Failed to update course";
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

  const deleteCourse = useCallback(async (id: number): Promise<void> => {
    try {
      dispatch({ type: "SET_ERROR", payload: null });
      dispatch({ type: "SET_LOADING", payload: true });

      await axiosInstance.delete(`/courses/delete/${id}`);

      dispatch({ type: "DELETE_COURSE", payload: id });
    } catch (error: any) {
      console.error("Error deleting course:", error);

      let errorMessage = "Failed to delete course";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  }, []);

  const addLecturerToCourse = useCallback(
    async (courseId: number, lecturerId: number): Promise<Course> => {
      try {
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_LOADING", payload: true });

        const response = await axiosInstance.post<ApiResponse<Course>>(
          `/courses/add-lecturer/${courseId}/${lecturerId}`
        );
        const updatedCourse = response.data.body;

        dispatch({ type: "ADD_LECTURER_TO_COURSE", payload: updatedCourse });

        // Also refresh the course details if we're viewing details
        if (state.courseDetails && state.courseDetails.courseId === courseId) {
          await fetchCourseDetails(courseId);
        }

        return updatedCourse;
      } catch (error: any) {
        console.error("Error adding lecturer to course:", error);

        let errorMessage = "Failed to add lecturer to course";
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        dispatch({ type: "SET_ERROR", payload: errorMessage });
        throw error;
      }
    },
    [state.courseDetails, fetchCourseDetails]
  );

  const fetchCoursesByDepartment = useCallback(async (departmentId: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const response = await axiosInstance.get<ApiResponse<Course[]>>(
        `/courses/department/${departmentId}`
      );

      console.log("Courses by department response:", response.data);
      console.log("Courses from body:", response.data.body);

      const courses = response.data.body || [];

      if (!Array.isArray(courses)) {
        console.error("Expected array but got:", courses);
        throw new Error(
          "Invalid response format: expected array in body field"
        );
      }

      dispatch({ type: "FETCH_COURSES_BY_DEPARTMENT", payload: courses });

      console.log(
        "Successfully updated state with department courses:",
        courses
      );
    } catch (error: any) {
      console.error("Error fetching courses by department:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch courses for department";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    }
  }, []);

  const clearCourses = useCallback(() => {
    dispatch({ type: "CLEAR_COURSES" });
  }, []);

  // Auto-fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <CourseContext.Provider
      value={{
        state,
        fetchCourses,
        fetchCourseAnalytics,
        fetchCourseById,
        fetchCourseDetails,
        createCourse,
        updateCourse,
        deleteCourse,
        addLecturerToCourse,
        setError,
        setLoading,
        setAnalyticsError,
        setAnalyticsLoading,
        setDetailsError,
        setDetailsLoading,
        fetchCoursesByDepartment,
        clearCourses,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

// Custom hook to use Course context
export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
};
