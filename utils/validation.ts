
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validateMoroccanPhone = (phone: string): boolean => {
  // Moroccan formats: +2126..., +2127..., 06..., 07..., 05...
  const re = /^(?:\+212|0)([5-7])\d{8}$/;
  return re.test(phone.replace(/\s/g, ''));
};

export const validatePasswordStrength = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) return { isValid: false, message: "Password must be at least 8 characters." };
  if (!/[A-Z]/.test(password)) return { isValid: false, message: "Add at least one uppercase letter." };
  if (!/[0-9]/.test(password)) return { isValid: false, message: "Add at least one number." };
  if (!/[!@#$%^&*]/.test(password)) return { isValid: false, message: "Add a special character (!@#$%^&*)." };
  return { isValid: true, message: "" };
};
