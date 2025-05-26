import { Event, User } from "@prisma/client";
import { EventCard } from "./EventCard";

interface EventListProps {
  events: (Event & {
    creator: User;
    participants: {
      id: number;
      status: string;
      user: User;
    }[];
  })[];
}

export const EventList = ({ events }: EventListProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};
