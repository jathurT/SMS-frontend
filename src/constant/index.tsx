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
    icon: <Home size={20} />, // Icon with size
  },
  // {
  //   title: "Admin",
  //   path: "/admin",
  //   icon: <Shield size={20} />,
  // },
  {
    title: "Department",
    path: "/department",
    icon: <Building size={20} />, // Building icon
  },
  {
    title: "Lecturer",
    path: "/lecturer",
    icon: <GraduationCap size={20} />, // Academic hat icon
  },
  {
    title: "Student",
    path: "/student",
    icon: <Users size={20} />, // Users icon
  },
  {
    title: "Course",
    path: "/course",
    icon: <BookOpen size={20} />,
  },
  {
    title: "Attendance",
    path: "/attendance",
    icon: <CheckSquare size={20} />, // Check square icon
  },
  {
    title: "Enrollment",
    path: "/enrollment",
    icon: <UserPlus size={20} />, // User plus icon
  },
  {
    title: "My Profile",
    path: "/profile",
    icon: <UserCircle size={20} />,
  },
];


const columnHeadersDepartment = [
  "Department ID",
  "Department Name",
];

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
]

export {
  navLinks,
  columnHeadersDepartment, 
  columnHeadersLecturer,
  columnHeadersStudent,
  columnHeadersCourse,
}