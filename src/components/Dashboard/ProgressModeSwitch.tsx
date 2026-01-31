"use client";

import { ProgressMode } from "@/types";
import { PROGRESS_MODE_LABELS, PROGRESS_MODE } from "@/lib/constants";

interface ProgressModeSwitchProps {
  mode: ProgressMode;
  onChange: (mode: ProgressMode) => void;
}

export function ProgressModeSwitch({
  mode,
  onChange,
}: ProgressModeSwitchProps) {
  const isTicketsMode = mode === PROGRESS_MODE.TICKETS;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-tertiary-blue rounded-md">
      <span className="text-xs text-text-secondary font-medium">
        {PROGRESS_MODE_LABELS.STORY_POINTS_SHORT}
      </span>
      <button
        onClick={() =>
          onChange(
            isTicketsMode ? PROGRESS_MODE.STORY_POINTS : PROGRESS_MODE.TICKETS,
          )
        }
        className="relative w-11 h-6 rounded-full bg-primary-blue transition-smooth"
        aria-label="Toggle progress mode"
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-text-primary rounded-full shadow-md transition-smooth ${
            isTicketsMode ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-xs text-text-secondary font-medium">
        {PROGRESS_MODE_LABELS.TICKETS}
      </span>
    </div>
  );
}
