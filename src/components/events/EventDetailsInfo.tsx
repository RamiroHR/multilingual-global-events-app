import { memo } from "react";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Globe } from "lucide-react";
import { EventDetailsInfoProps } from "@/lib/types/components";

export const EventDetailsInfo = memo(
  ({ date, isOnline, location, participantsCount, maxCapacity }: EventDetailsInfoProps) => {
    return (
      <div className="mb-8 space-y-4">
        <div className="flex items-center text-space-300">
          <Calendar className="mr-2 size-5 text-cosmic-500" />
          <span>{format(new Date(date), "PPP p")}</span>
        </div>

        <div className="flex items-center text-space-300">
          {isOnline ? (
            <>
              <Globe className="mr-2 size-5 text-cosmic-500" />
              <span>Online Event</span>
            </>
          ) : (
            <>
              <MapPin className="mr-2 size-5 text-cosmic-500" />
              <span>{location}</span>
            </>
          )}
        </div>

        <div className="flex items-center text-space-300">
          <Users className="mr-2 size-5 text-cosmic-500" />
          <span>
            {participantsCount} / {maxCapacity} participants
          </span>
        </div>
      </div>
    );
  }
);

EventDetailsInfo.displayName = "EventDetailsInfo";
