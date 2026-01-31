export const PROGRESS_MODE = Object.freeze({
  STORY_POINTS: 'story-points',
  TICKETS: 'tickets',
});

export const PROGRESS_MODE_LABELS = Object.freeze({
  STORY_POINTS: 'Story Points',
  TICKETS: 'Tickets',
  STORY_POINTS_SHORT: 'SP',
});

export const COLUMN_HEADERS = Object.freeze({
  label: 'Label',
  completedTickets: `✓ ${PROGRESS_MODE_LABELS.TICKETS}`,
  totalTickets: `Σ ${PROGRESS_MODE_LABELS.TICKETS}`,
  completedSP: `✓ ${PROGRESS_MODE_LABELS.STORY_POINTS_SHORT}`,
  totalSP: `Σ ${PROGRESS_MODE_LABELS.STORY_POINTS_SHORT}`,
  deadline: 'Deadline',
  workingDays: 'Days',
  progress: 'Progress',
});

export const COLUMN_TOOLTIPS = Object.freeze({
  completedTickets: `Number of completed ${PROGRESS_MODE_LABELS.TICKETS.toLowerCase()}`,
  totalTickets: `Total number of ${PROGRESS_MODE_LABELS.TICKETS.toLowerCase()}`,
  completedSP: `${PROGRESS_MODE_LABELS.STORY_POINTS} of completed ${PROGRESS_MODE_LABELS.TICKETS.toLowerCase()}`,
  totalSP: `Total ${PROGRESS_MODE_LABELS.STORY_POINTS}`,
  deadline: 'Declared completion date',
  workingDays: 'Working days remaining until deadline',
  progress: 'Completion percentage',
});

export const getProgressTooltip = (mode: 'story-points' | 'tickets') => {
  return mode === PROGRESS_MODE.STORY_POINTS
    ? `Completion percentage based on ${PROGRESS_MODE_LABELS.STORY_POINTS}`
    : `Completion percentage based on number of ${PROGRESS_MODE_LABELS.TICKETS.toLowerCase()}`;
};
