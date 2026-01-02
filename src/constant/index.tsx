import {
  Home,
  Calendar,
  GraduationCap,
  UserCircle,
  Users,
  BookOpen,
  UserPlus,
  CheckSquare,
  Building,
} from "lucide-react";

// Define roles that match your backend
export const ROLES = {
  ADMIN: 'ADMIN',
  DEPARTMENT_ADMIN: 'DEPARTMENT_ADMIN',
  LECTURER: 'LECTURER',
  STUDENT: 'STUDENT'
} as const;

// Navigation link interface
interface NavLink {
  title: string;
  path: string;
  icon: JSX.Element;
  roles: string[]; // Roles that can access this link
}

// Navigation links with role-based access
const allNavLinks: NavLink[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: <Home size={20} />,
    roles: [ROLES.ADMIN, ROLES.DEPARTMENT_ADMIN, ROLES.LECTURER, ROLES.STUDENT], // All roles can access dashboard
  },
  {
    title: "Department",
    path: "/department",
    icon: <Building size={20} />,
    roles: [ROLES.ADMIN], // Only admin can manage departments
  },
  {
    title: "Lecturer",
    path: "/lecturer",
    icon: <GraduationCap size={20} />,
    roles: [ROLES.ADMIN], // Only admin can manage lecturers (based on your routes)
  },
  {
    title: "Student",
    path: "/student",
    icon: <Users size={20} />,
    roles: [ROLES.ADMIN, ROLES.LECTURER], // Admin and lecturers can view students
  },
  {
    title: "Course",
    path: "/course",
    icon: <BookOpen size={20} />,
    roles: [ROLES.ADMIN, ROLES.LECTURER], // All can view courses
  },
  {
    title: "Enrollment",
    path: "/enrollment",
    icon: <UserPlus size={20} />,
    roles: [ROLES.ADMIN, ROLES.LECTURER, ROLES.STUDENT], // All can view enrollments
  },
  {
    title: "Session",
    path: "/session",
    icon: <Calendar size={20} />,
    roles: [ROLES.ADMIN, ROLES.LECTURER], // Admin and lecturers can manage sessions
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: <CheckSquare size={20} />,
    roles: [ROLES.ADMIN, ROLES.LECTURER, ROLES.STUDENT], // All can view attendance
  },
  {
    title: "My Profile",
    path: "/profile",
    icon: <UserCircle size={20} />,
    roles: [ROLES.ADMIN, ROLES.DEPARTMENT_ADMIN, ROLES.LECTURER, ROLES.STUDENT], // All can access their profile
  },
];

// Function to filter navigation links based on user roles
export const getFilteredNavLinks = (userRoles: string[]): NavLink[] => {
  if (!userRoles || userRoles.length === 0) {
    // If no roles, only show dashboard and profile
    return allNavLinks.filter(link => link.path === "/" || link.path === "/profile");
  }

  return allNavLinks.filter(link => {
    // Check if user has any of the required roles for this link
    return link.roles.some(role => userRoles.includes(role));
  });
};

// Export the original navLinks for backward compatibility
export const navLinks = allNavLinks.map(({ roles, ...link }) => link);

// Table column headers (unchanged)
const columnHeadersDepartment = ["Department ID", "Department Name"];

const columnHeadersLecturer = [
  "Lecturer ID",
  "First Name",
  "Last Name",
  "Email",
  "Phone Number",
  "Department Name",
  "Address",
  "Date of Birth",
];

const columnHeadersStudent = [
  "Student ID",
  "First Name",
  "Last Name",
  "Email",
  "Phone Number",
  "Address",
  "Date of Birth",
];

const columnHeadersCourse = [
  "Course ID",
  "Course Name",
  "Course Code",
  "Enrollment Key",
  "Credits",
  "Semester",
  "Department Name",
  "Created At",
];

const columnHeadersEnrollment = [
  "Enrollment ID",
  "Student ID",
  "Student Name",
  "Course ID",
  "Course Name",
  "Course Code",
  "Enrollment Date",
];

const columnHeadersAttendance = [
  "Student ID",
  "Student Name",
  "Session ID",
  "Session Name",
  "Lecturer Name",
  "Date",
  "Start Time",
  "End Time",
];

const columnHeadersSession = [
  "Session ID",
  "Course Name",
  "Course Code",
  "Lecturer Name",
  "Date",
  "Start Time",
  "End Time",
];

export {
  columnHeadersDepartment,
  columnHeadersLecturer,
  columnHeadersStudent,
  columnHeadersCourse,
  columnHeadersEnrollment,
  columnHeadersAttendance,
  columnHeadersSession,
};