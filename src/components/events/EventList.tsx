import { memo } from "react";
import { EventCard } from "./EventCard";
import { EventListProps } from "@/lib/types/components";

export const EventList = memo(({ events }: EventListProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
});

EventList.displayName = "EventList";
