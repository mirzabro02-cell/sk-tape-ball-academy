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

export function sanitizeExternalUrl(rawUrl?: string | null): string | null {
  const trimmed = rawUrl?.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}

export function containsUnsafeHtml(values: string[]): boolean {
  return values.some((val) => /[<>]/.test(val));
}

const ALLOWED_IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_IMAGE_EXT = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateImageFile(file: File): string | null {
  const lowerName = file.name.toLowerCase();
  const hasValidExt = ALLOWED_IMAGE_EXT.some((ext) => lowerName.endsWith(ext));
  const hasValidMime = ALLOWED_IMAGE_MIME.has(file.type.toLowerCase());

  if (!hasValidExt || !hasValidMime) {
    return 'Please choose a valid JPG, PNG, or WebP image file.';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Image file size must be 5 MB or smaller.';
  }
  return null;
}

const UNCONFIRMED_PATTERN = /^(to be confirmed|to be provided|tbd|n\/a|pending confirmation)\.?$/i;

export function sanitizeConfirmedText(value?: string | null): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) {
    return '';
  }
  if (UNCONFIRMED_PATTERN.test(trimmed) || /\bto be confirmed\b/i.test(trimmed)) {
    return '';
  }
  return trimmed;
}


