"use client";

import { useState, useEffect } from "react";
import { Event, User } from "@prisma/client";
////////////////////////////////////////////////////////////////
// Use mock data only in development
import { getMockEventsByCreator } from "@/mocks/events";
////////////////////////////////////////////////////////////////
import { EventOwnerCard } from "@/components/events/EventOwnerCard";

export default function MyEventsPage() {
  const [events, setEvents] = useState<
    (Event & {
      creator: User;
      participants: {
        id: number;
        status: string;
        user: User;
      }[];
    })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ////////////////////////////////////////////////////////////////
    // For now, we'll use a hardcoded creator ID (1), with Mock data
    const userEvents = getMockEventsByCreator(1);
    ////////////////////////////////////////////////////////////////

    // Sort events by date (upcoming first)
    const sortedEvents = userEvents.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setEvents(sortedEvents);
    setLoading(false);
  }, []);

  const handleEdit = (eventId: number) => {
    // TODO: Implement edit functionality
    console.log("Edit event:", eventId);
  };

  const handleCancel = (eventId: number) => {
    // TODO: Implement cancel functionality
    console.log("Cancel event:", eventId);
  };

  const handleManageSubscriptions = (eventId: number) => {
    // TODO: Implement subscription management
    console.log("Manage subscriptions:", eventId);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 items-center justify-between">
        <h1 className="mb-2 text-2xl font-bold text-terracotta-800">
          My Events
        </h1>
        <p className="mb-6 text-lunar-200">
          Create and manage events that your are hosting!
        </p>
        <button className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600">
          Create New Event
        </button>
      </div>
      <div className="space-y-4">
        {events.map((event) => (
          <EventOwnerCard
            key={event.id}
            event={event}
            onEdit={handleEdit}
            onCancel={handleCancel}
            onManageSubscriptions={handleManageSubscriptions}
          />
        ))}
      </div>
    </div>
  );
}
