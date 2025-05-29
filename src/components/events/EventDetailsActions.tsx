import { memo } from "react";
import { EventDetailsActionsProps } from "@/lib/types/components";

export const EventDetailsActions = memo(
  ({ hasApplied, isFull, spotsLeft, onJoinEvent, error }: EventDetailsActionsProps) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onJoinEvent}
            className={`rounded-md px-6 py-3 text-white-50 transition-colors ${
              isFull || hasApplied
                ? "cursor-not-allowed bg-gray-400"
                : "bg-cosmic-500 hover:bg-cosmic-600"
            }`}
            disabled={isFull || hasApplied}
          >
            {isFull ? "Event Full" : "Join Event"}
          </button>

          {hasApplied && (
            <span className="text-red text-terracotta">
              Your application was sent to the organizer!
            </span>
          )}

          {error && (
            <div className="mt-4 rounded-md bg-red-500/10 p-4 text-center text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        <span className="text-sm">
          {isFull ? (
            <span className="text-terracotta-500">Full</span>
          ) : (
            <span className="text-cosmic-500">{spotsLeft} spots left</span>
          )}
        </span>
      </div>
    );
  }
);

EventDetailsActions.displayName = "EventDetailsActions";
