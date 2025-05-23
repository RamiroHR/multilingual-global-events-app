import { Event, User } from "@prisma/client";
import { format } from "date-fns";
import { MapPin, Users, Globe, Edit, Users2, X } from "lucide-react";

interface EventOwnerCardProps {
  event: Event & {
    creator: User;
    participants: {
      id: number;
      status: string;
      user: User;
    }[];
  };
  onEdit: (eventId: number) => void;
  onCancel: (eventId: number) => void;
  onManageSubscriptions: (eventId: number) => void;
}

export const EventOwnerCard = ({
  event,
  onEdit,
  onCancel,
  onManageSubscriptions,
}: EventOwnerCardProps) => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-lunar-200 bg-gray-50 p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Event Info Section */}
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-space-100">{event.title}</h3>
          <span className="text-sm text-lunar-500">{format(new Date(event.date), "PPP")}</span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-space-300">
          {/* Location/Online Status */}
          <div className="flex items-center">
            {event.isOnline ? (
              <>
                <Globe className="mr-1 size-4 text-cosmic-500" />
                <span>Online Event</span>
              </>
            ) : (
              <>
                <MapPin className="mr-1 size-4 text-cosmic-500" />
                <span>{event.location}</span>
              </>
            )}
          </div>

          {/* Participants Count */}
          <div className="flex items-center">
            <Users className="mr-1 size-4 text-cosmic-500" />
            <span>
              {event.participants.length} / {event.maxCapacity} participants
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="ml-4 flex gap-2">
        <button
          onClick={() => onEdit(event.id)}
          className="flex items-center rounded-md bg-cosmic-500 px-3 py-2 text-white-50 transition-colors hover:bg-cosmic-600"
          title="Edit Event"
        >
          <Edit className="size-4" />
        </button>
        <button
          onClick={() => onManageSubscriptions(event.id)}
          className="flex items-center rounded-md bg-cosmic-500 px-3 py-2 text-white-50 transition-colors hover:bg-cosmic-600"
          title="Manage Subscriptions"
        >
          <Users2 className="size-4" />
        </button>
        <button
          onClick={() => onCancel(event.id)}
          className="flex items-center rounded-md bg-terracotta-500 px-3 py-2 text-white-50 transition-colors hover:bg-terracotta-600"
          title="Cancel Event"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
};
