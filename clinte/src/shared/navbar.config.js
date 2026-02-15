export const MAIN_LINKS = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "About", to: "/about" },
];

export const NAV_LINK = {
  guest: [
    { label: "Login", to: "/auth/login", type: "secondary" },
    { label: "Register", to: "/auth/register", type: "primary" },
  ],

  student: [
    { label: "Dashboard", to: "/dashboard", type: "secondary" },
    { label: "Become Teacher", to: "/teacher-request", type: "secondary" },
    { action: "logout" },
  ],

  teacher: [
    { label: "Teacher Panel", to: "/teacher", type: "secondary" },
    { label: "Dashboard", to: "/dashboard", type: "secondary" },
    { action: "logout" },
  ],

  admin: [
    { label: "Admin Panel", to: "/admin", type: "secondary" },
    { label: "Teacher Requests", to: "/admin/teacher-requests", type: "secondary" },
    { label: "Dashboard", to: "/dashboard", type: "secondary" },
    { action: "logout" },
  ],
};
