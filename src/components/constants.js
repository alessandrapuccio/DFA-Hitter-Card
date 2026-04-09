export const BORDER = '1.5px solid #94a3b8';
export const HEADER_BG = '#1e3a5f';

export function gradeBg(grade) {
  if (grade >= 60) return '#dcfce7';
  if (grade >= 55) return '#bbf7d0';
  if (grade >= 45) return '#f3f4f6';
  if (grade >= 40) return '#fee2e2';
  return '#fca5a5';
}

export function gradeTextColor(grade) {
  if (grade >= 55) return '#16a34a';
  if (grade >= 45) return '#374151';
  return '#dc2626';
}
