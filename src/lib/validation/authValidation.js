/**
 * Email validation function
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true, error: null };
};

/**
 * Password strength validation function
 * Returns: { valid, error, strength }
 * Strength: 'weak', 'medium', 'strong'
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: 'Password is required', strength: 'weak' };
  }

  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;

  let strength = 'weak';
  let error = null;

  if (metRequirements < 3) strength = 'weak';
  else if (metRequirements < 5) strength = 'medium';
  else strength = 'strong';

  // Generate error message based on first missing requirement
  if (!requirements.length) {
    error = 'Password must be at least 8 characters';
  } else if (!requirements.uppercase) {
    error = 'Password must contain at least one uppercase letter';
  } else if (!requirements.lowercase) {
    error = 'Password must contain at least one lowercase letter';
  } else if (!requirements.number) {
    error = 'Password must contain at least one number';
  } else if (!requirements.special) {
    error = 'Password must contain at least one special character (!@#$%^&*)';
  }

  const valid = metRequirements === 5 && requirements.length;

  return { valid, error, strength, requirements };
};

/**
 * Password confirmation validation
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { valid: false, error: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }
  return { valid: true, error: null };
};

/**
 * Full registration validation
 */
export const validateRegistration = (email, password, confirmPassword) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return { valid: false, field: 'email', error: emailValidation.error };
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return {
      valid: false,
      field: 'password',
      error: passwordValidation.error,
    };
  }

  const confirmValidation = validatePasswordMatch(password, confirmPassword);
  if (!confirmValidation.valid) {
    return {
      valid: false,
      field: 'confirmPassword',
      error: confirmValidation.error,
    };
  }

  return { valid: true, error: null };
};

/**
 * Full login validation
 */
export const validateLogin = (email, password) => {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    return { valid: false, field: 'email', error: emailValidation.error };
  }

  if (!password) {
    return { valid: false, field: 'password', error: 'Password is required' };
  }

  return { valid: true, error: null };
};
