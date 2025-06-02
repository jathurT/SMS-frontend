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

const navLinks = [
  {
    title: "Dashboard",
    path: "/",
    icon: <Home size={20} />,
  },
  {
    title: "Department",
    path: "/department",
    icon: <Building size={20} />,
  },
  {
    title: "Lecturer",
    path: "/lecturer",
    icon: <GraduationCap size={20} />,
  },
  {
    title: "Student",
    path: "/student",
    icon: <Users size={20} />,
  },
  {
    title: "Course",
    path: "/course",
    icon: <BookOpen size={20} />,
  },
  {
    title: "Enrollment",
    path: "/enrollment",
    icon: <UserPlus size={20} />,
  },
  {
    title: "Session",
    path: "/session",
    icon: <Calendar size={20} />,
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: <CheckSquare size={20} />,
  },
  {
    title: "My Profile",
    path: "/profile",
    icon: <UserCircle size={20} />,
  },
];

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
  navLinks,
  columnHeadersDepartment,
  columnHeadersLecturer,
  columnHeadersStudent,
  columnHeadersCourse,
  columnHeadersEnrollment,
  columnHeadersAttendance,
  columnHeadersSession,
};