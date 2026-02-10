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

  user: [
    { label: "Dashboard", to: "/dashboard", type: "secondary" },
    { action: "logout" },
  ],

  admin: [
    { label: "Admin Panel", to: "/admin", type: "secondary" },
    { action: "logout" },
  ],
};