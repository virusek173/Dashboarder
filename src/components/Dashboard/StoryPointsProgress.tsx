"use client";

import { ProgressMode } from "@/types";
import { PROGRESS_MODE_LABELS, PROGRESS_MODE } from "@/lib/constants";

interface StoryPointsProgressProps {
  completedSP: number;
  totalSP: number;
  completedTickets: number;
  totalTickets: number;
  progressMode: ProgressMode;
}

export function StoryPointsProgress({
  completedSP,
  totalSP,
  completedTickets,
  totalTickets,
  progressMode,
}: StoryPointsProgressProps) {
  const isTicketsMode = progressMode === PROGRESS_MODE.TICKETS;

  const completed = isTicketsMode ? completedTickets : completedSP;
  const total = isTicketsMode ? totalTickets : totalSP;
  const remaining = total - completed;
  const unit = isTicketsMode ? PROGRESS_MODE_LABELS.TICKETS : PROGRESS_MODE_LABELS.STORY_POINTS_SHORT;

  const completedPercent = total > 0 ? (completed / total) * 100 : 0;
  const remainingPercent = total > 0 ? (remaining / total) * 100 : 0;

  return (
    <div className="p-6 bg-bg-secondary border border-tertiary-blue border-t-0 rounded-b-lg">
      <div className="space-y-4">
        {/* Completed */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-status-success">
              Completed
            </span>
            <span className="text-sm font-bold text-status-success">
              {completed} {unit} ({completedPercent.toFixed(1)}%)
            </span>
          </div>
          <div className="h-4 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-status-success transition-all duration-700 ease-out rounded-full"
              style={{ width: `${completedPercent}%` }}
            />
          </div>
        </div>

        {/* Remaining */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-status-warning">
              Remaining
            </span>
            <span className="text-sm font-bold text-status-warning">
              {remaining} {unit} ({remainingPercent.toFixed(1)}%)
            </span>
          </div>
          <div className="h-4 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-status-warning transition-all duration-700 ease-out rounded-full"
              style={{ width: `${remainingPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Motivational summary */}
      <div className="mt-4 pt-4 border-t border-tertiary-blue text-center">
        <span className="text-text-secondary text-sm">
          {completedPercent >= 100 ? (
            <span className="text-status-success font-semibold">
              All done! Great job team! 🎉
            </span>
          ) : completedPercent >= 75 ? (
            <span className="text-status-success">
              Almost there! Keep pushing!
            </span>
          ) : completedPercent >= 50 ? (
            <span className="text-status-warning">
              Halfway through! You got this!
            </span>
          ) : (
            <span className="text-text-muted">Let&apos;s get this done!</span>
          )}
        </span>
      </div>
    </div>
  );
}
