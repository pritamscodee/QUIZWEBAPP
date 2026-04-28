export const validateEmail = (email: string): boolean =>
   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(email).toLowerCase());

export const validatePassword = (password: string): boolean => {
   if (!password) return false;
   return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
   if (!username) return false;
   return username.length >= 3 && username.length <= 30;
};

interface ValidationErrors {
   username?: string;
   email?: string;
   password?: string;
   confirmPassword?: string;
}

interface FormData {
   username?: string;
   email?: string;
   password?: string;
   confirmPassword?: string;
}

export const getValidationErrors = (form: FormData): ValidationErrors => {
   const errors: ValidationErrors = {};
   if (form.username !== undefined && !validateUsername(form.username))
      errors.username = 'Username must be 3-30 characters';
   if (form.email !== undefined && !validateEmail(form.email))
      errors.email = 'Invalid email address';
   if (form.password !== undefined && !validatePassword(form.password))
      errors.password = 'Password must be at least 6 characters';
   if (form.confirmPassword !== undefined && form.password !== form.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';
   return errors;
};