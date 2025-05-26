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
    title: "Schedule",
    path: "/schedule",
    icon: <Calendar size={20} />,
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

const columnHeadersBooking = [
  "Reference Id",
  "Appointment Number",
  "Name",
  "NIC",
  "Contact Number",
  "Email",
  "Address",
  "ScheduleId",
  "scheduleDate",
  "scheduleDayOfWeek",
  "scheduleStatus",
  "scheduleStartTime",
  "doctorName",
  "Status",
  "Date",
  "Day Of Week",
  "Created At",
];

const columnHeadersDoctor = [
  "Id",
  "User Name",
  "Email",
  "Gender",
  "First Name",
  "Specialization",
  "License Number",
  "Phone Number",
  "Nic",
  "Roles",
];

const columnHeadersReceptionist = [
  "Id",
  "User Name",
  "Email",
  "Gender",
  "First Name",
  "Phone Number",
  "Nic",
  "Roles",
];

const columnHeadersPatient = [
  "Id", "Name", "Email", "NIC", "Contact Number"
];

const columnHeadersSchedule = [
  "Id",
  "Date",
  "Day Of Week",
  "Status",
  "Number Of Bookings",
  "Bookings",
  "Start Time",
  "End Time",
  "Duration",
  "Dentist Id",
  "Capacity",
  "Available Slots",
  "Created At",
];
export {
  navLinks,
  columnHeadersBooking,
  columnHeadersDoctor,
  columnHeadersSchedule,
  columnHeadersReceptionist,
  columnHeadersPatient,
};
