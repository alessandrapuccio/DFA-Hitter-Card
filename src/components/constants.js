export const BORDER = '1.5px solid #94a3b8';
export const HEADER_BG = '#1e3a5f';

export function gradeBg(grade) {
  if (grade >= 80) return '#16a34a'; // darkest green (was #14532d)
  if (grade >= 75) return '#4ade80'; // (was #166534)
  if (grade >= 70) return '#86efac'; // (was #15803d)
  if (grade >= 65) return '#bbf7d0'; // (was #16a34a)
  if (grade >= 60) return '#dcfce7'; // lightest green
  if (grade >= 55) return '#f3f4f6'; // neutral
  if (grade >= 45) return '#f3f4f6'; // neutral
  if (grade >= 40) return '#fee2e2'; // lightest red
  if (grade >= 35) return '#fca5a5';
  if (grade >= 30) return '#f87171';
  if (grade >= 25) return '#f87171'; // (was #b91c1c)
  if (grade >= 20) return '#ef4444'; // darkest red (was #7f1d1d)
  return '#ef4444'; // below 20
}

export function gradeTextColor(grade) {
  if (grade >= 55) return '#16a34a';
  if (grade >= 45) return '#374151';
  return '#dc2626';
}
