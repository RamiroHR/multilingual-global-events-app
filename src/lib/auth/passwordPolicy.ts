export const passwordPolicy = {
  // condiiton activations
  minLength: 6,
  requireUpperCase: true,
  requireLowerCase: true,
  requireNumber: true,
  requireSpecialChars: false,

  // verification functions
  validate: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < passwordPolicy.minLength) {
      errors.push(`Password must be at least ${passwordPolicy.minLength} characters.`);
    }

    if (passwordPolicy.requireUpperCase && !/[A-Z]/.test(password)) {
      errors.push(`Password must contain at least one uppercase.`);
    }

    if (passwordPolicy.requireLowerCase && !/[a-z]/.test(password)) {
      errors.push(`Password must contain at least one lowercase.`);
    }

    if (passwordPolicy.requireNumber && !/\d/.test(password)) {
      errors.push(`Password must contain at least one number.`);
    }

    if (passwordPolicy.requireSpecialChars && !/[!@#$%^&*]/.test(password)) {
      errors.push(`Password must contain at least one special character (!@#$%^&*).`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};
