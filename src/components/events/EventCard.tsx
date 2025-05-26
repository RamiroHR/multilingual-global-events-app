import { Event, User } from "@prisma/client";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: Event & {
    creator: User;
    participants: {
      id: number;
      status: string;
      user: User;
    }[];
  };
}

export const EventCard = ({ event }: EventCardProps) => {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-lg border border-lunar-200 bg-gray-50 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="flex h-full flex-col p-6">
        {/* Event Title and Creator */}
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-semibold text-space-100">
            {event.title}
          </h3>
          <span className="text-sm text-lunar-500">
            by {event.creator.username}
          </span>
        </div>

        {/* Event Description */}
        <p className="mb-4 line-clamp-2 text-space-200">{event.description}</p>

        {/* Event Details */}
        <div className="flex-1 space-y-3">
          {/* Date */}
          <div className="flex items-center text-space-300">
            <Calendar className="mr-2 size-5 text-cosmic-500" />
            <span>{format(new Date(event.date), "PPP p")}</span>
          </div>

          {/* Location or Online Status */}
          <div className="flex items-center text-space-300">
            {event.isOnline ? (
              <>
                <Globe className="mr-2 size-5 text-cosmic-500" />
                <span>Online Event</span>
              </>
            ) : (
              <>
                <MapPin className="mr-2 size-5 text-cosmic-500" />
                <span>{event.location}</span>
              </>
            )}
          </div>

          {/* Capacity */}
          <div className="flex items-center text-space-300">
            <Users className="mr-2 size-5 text-cosmic-500" />
            <span>
              {event.participants.length} / {event.maxCapacity} participants
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => router.push(`/dashboard/explore/${event.id}`)}
            className="rounded-md bg-cosmic-500 px-4 py-2 text-white-50 transition-colors hover:bg-cosmic-600"
          >
            View Details
          </button>
          <span className="text-sm">
            {event.participants.length === event.maxCapacity ? (
              <span className="text-terracotta-500">Full</span>
            ) : (
              <span className="text-cosmic-500">
                {event.maxCapacity - event.participants.length} spots left
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
