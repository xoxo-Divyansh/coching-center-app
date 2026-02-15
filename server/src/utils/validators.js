const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email) =>
  typeof email === "string" && EMAIL_REGEX.test(email.trim().toLowerCase());

export const isValidPassword = (password) =>
  typeof password === "string" && password.length >= 6;

export const isNonEmptyString = (value, minLength = 1) =>
  typeof value === "string" && value.trim().length >= minLength;

export const isValidRole = (role) =>
  ["student", "teacher", "admin"].includes(role);

export const isValidTeacherRequestStatus = (status) =>
  ["approved", "rejected"].includes(status);

export const isValidTeacherRequestFilterStatus = (status) =>
  ["all", "pending", "approved", "rejected"].includes(status);

export const isValidUserFilterRole = (role) =>
  ["all", "student", "teacher", "admin"].includes(role);
