import { memo } from "react";
import { EventDetailsActionsProps } from "@/lib/types/components";

export const EventDetailsActions = memo(
  ({ hasApplied, status, isFull, onJoinEvent, error }: EventDetailsActionsProps) => {
    return (
      <div className="mt-6 flex items-center justify-between">
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
            {isFull ? "Event is Full" : "Join Event"}
          </button>

          {status === "PENDING" && (
            <span className="text-red text-terracotta">
              Your application was sent to the organizer! Await his reply.
            </span>
          )}

          {status === "ACCEPTED" && (
            <span className="text-red text-terracotta">
              You already applied. You have secured your spot! :)
            </span>
          )}

          {status === "REJECTED" && (
            <span className="text-red text-terracotta">
              You already applied. The organizer rejected your application! :(
            </span>
          )}

          {error && (
            <div className="mt-4 rounded-md bg-red-500/10 p-4 text-center text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        <span className="text-sm">
          {status === "ACCEPTED" ? (
            <span className="text-terracotta-500">Event details unlocked</span>
          ) : (
            <span className="text-cosmic-500">Join to access meeting info</span>
          )}
        </span>
      </div>
    );
  }
);

EventDetailsActions.displayName = "EventDetailsActions";
