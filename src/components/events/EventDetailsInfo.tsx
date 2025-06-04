import { memo } from "react";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Globe, EyeOff } from "lucide-react";
import { EventDetailsInfoProps } from "@/lib/types/components";

export const EventDetailsInfo = memo(
  ({
    date,
    endDate,
    isOnline,
    webinar,
    location,
    city,
    country,
    participantsCount,
    maxCapacity,
    status,
    showParticipants,
    textClassName,
  }: EventDetailsInfoProps) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center text-space-300">
          <Calendar className="mr-2 size-5 text-cosmic-500" />
          <span className={textClassName}>{format(new Date(date), "PPP")} - </span>
          {status === "ACCEPTED" ? (
            <span className={`${textClassName} ml-1.5`}>
              {format(new Date(date), "p")} to {format(new Date(endDate), "p")}
            </span>
          ) : (
            <>
              <span className="relative ml-2 inline-flex h-6 w-24 items-center justify-center rounded bg-terracotta-500/20 backdrop-blur-sm">
                <EyeOff className="size-4 text-space-300/50" />
              </span>
            </>
          )}
        </div>

        <div className="flex items-center text-space-300">
          {isOnline ? (
            <>
              <Globe className="mr-2 size-5 text-cosmic-500" />
              {status === "ACCEPTED" ? (
                <>
                  <span className={`${textClassName}`}>{webinar}</span>
                </>
              ) : (
                <>
                  <span className={`${textClassName}`}>Online Event - </span>
                  <span className="relative ml-2 inline-flex h-6 w-24 items-center justify-center rounded bg-terracotta-500/20 backdrop-blur-sm">
                    <EyeOff className="size-4 text-space-300/50" />
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              <MapPin className="mr-2 size-5 text-cosmic-500" />
              <span className={textClassName}>
                {city}, {country} -
              </span>
              {status === "ACCEPTED" ? (
                <span className={`${textClassName} ml-1.5`}>{location}</span>
              ) : (
                <>
                  <span className="relative ml-2 inline-flex h-6 w-24 items-center justify-center rounded bg-terracotta-500/20 backdrop-blur-sm">
                    <EyeOff className="size-4 text-space-300/50" />
                  </span>
                </>
              )}
            </>
          )}
        </div>

        {showParticipants && [
          <>
            <div className="flex items-center text-space-300">
              <Users className="mr-2 size-5 text-cosmic-500" />
              <span>
                {participantsCount} / {maxCapacity} participants
              </span>
            </div>
          </>,
        ]}
      </div>
    );
  }
);

EventDetailsInfo.displayName = "EventDetailsInfo";
