export function calculateAgeFromDob(dobString: string): number | null {
  if (!dobString) {
    return null;
  }
  const parts = dobString.split('-');
  if (parts.length !== 3) {
    return null;
  }
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  const dob = new Date(year, month - 1, day);
  if (
    dob.getFullYear() !== year ||
    dob.getMonth() !== month - 1 ||
    dob.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (dob > todayMidnight || year < 1925) {
    return null;
  }

  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - (month - 1);
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.trim();
  if (!cleaned) {
    return false;
  }
  if (!/^[+\d\s\-()]+$/.test(cleaned)) {
    return false;
  }
  const digitsOnly = cleaned.replace(/\D/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

export function isValidEmailAddress(email: string): boolean {
  const cleaned = email.trim();
  if (!cleaned) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned);
}

export function isFutureOrTodayDate(dateString: string): boolean {
  if (!dateString) {
    return false;
  }
  const parts = dateString.split('-');
  if (parts.length !== 3) {
    return false;
  }
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  const target = new Date(year, month - 1, day);
  if (
    target.getFullYear() !== year ||
    target.getMonth() !== month - 1 ||
    target.getDate() !== day
  ) {
    return false;
  }

  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return target >= todayMidnight;
}
