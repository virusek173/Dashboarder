/**
 * Calculates the number of working days (Mon-Fri) between today and deadline.
 * Returns a negative number if deadline has passed.
 * Does not account for holidays - only weekends.
 */
export function calculateWorkingDays(deadline: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(deadline);
  target.setHours(0, 0, 0, 0);

  let workingDays = 0;
  const current = new Date(today);
  const isForward = target >= today;

  while (isForward ? current < target : current > target) {
    if (isForward) {
      current.setDate(current.getDate() + 1);
    } else {
      current.setDate(current.getDate() - 1);
    }

    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays += isForward ? 1 : -1;
    }
  }

  return workingDays;
}

/**
 * Calculates completion percentage based on ticket count
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Calculates progress percentage (returns float, not rounded)
 */
export function calculateProgressPercent(completed: number, total: number): number {
  return total > 0 ? (completed / total) * 100 : 0;
}

/**
 * Returns color for progress bar based on percentage
 */
export function getProgressColor(percent: number): string {
  if (percent >= 80) return 'status-success';
  if (percent >= 50) return 'status-warning';
  return 'status-danger';
}

/**
 * Returns color for working days based on remaining time
 */
export function getWorkingDaysColor(days: number): string {
  if (days > 5) return 'text-secondary';
  if (days >= 1) return 'status-warning';
  return 'status-danger';
}

/**
 * Formats date to DD.MM.YYYY, HH:MM format
 */
export function formatTimestamp(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year}, ${hours}:${minutes}`;
}

/**
 * Formats date to YYYY-MM-DD format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}
