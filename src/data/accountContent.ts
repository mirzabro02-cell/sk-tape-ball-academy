export interface PasswordStrengthResult {
  score: number;
  label: 'Weak' | 'Fair' | 'Strong';
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const label: PasswordStrengthResult['label'] =
    score >= 4 ? 'Strong' : score >= 2 ? 'Fair' : 'Weak';

  return { score, label, checks };
}
