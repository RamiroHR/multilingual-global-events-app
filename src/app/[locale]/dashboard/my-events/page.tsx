"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { EventOwnerCard } from "@/components/events/EventOwnerCard";
import { CreateEventForm } from "@/components/events/CreateEventForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useEvents } from "@/hooks/useEvents";
import { EventWithRelations, EventOptions } from "@/lib/types";

export default function MyEventsPage() {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);

  // memoize to fetch event only in mount and when this changes
  const config = useMemo<EventOptions>(
    () => ({
      type: "created",
      options: {
        timeFilter: "future",
        orderBy: "asc",
        onError: (err: string) => console.error(err),
      },
    }),
    []
  );

  const { data: events, loading, error, fetchEvents } = useEvents(config);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEdit = useCallback(
    (eventId: number) => {
      router.push(`/dashboard/my-events/${eventId}/edit`);
    },
    [router]
  );

  const handleCancel = useCallback(
    (eventId: number) => {
      router.push(`/dashboard/my-events/${eventId}/cancel`);
    },
    [router]
  );

  const handleManageSubscriptions = useCallback(
    (eventId: number) => {
      router.push(`/dashboard/my-events/${eventId}/subscriptions`);
    },
    [router]
  );

  const handleCreateSuccess = useCallback(() => {
    setShowCreateForm(false);
    fetchEvents(); // Refresh the events list
  }, [fetchEvents]);

  if (loading) {
    <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-terracotta-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 items-center justify-between">
        <h1 className="mb-2 text-2xl font-bold text-terracotta-800">My Events</h1>
        <p className="mb-6 text-lunar-200">Create and manage events that your are hosting!</p>
        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded bg-terracotta-700 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Create New Event
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="max-h-[90vh] w-[70%] max-w-4xl overflow-y-auto rounded-lg bg-space-200 shadow-xl">
            <CreateEventForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {Array.isArray(events) && events.length > 0 ? (
          events.map((event) => (
            <EventOwnerCard
              key={event.id}
              event={event as EventWithRelations}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onManageSubscriptions={handleManageSubscriptions}
            />
          ))
        ) : (
          <div className="text-center text-lunar-200">No events found.</div>
        )}
      </div>
    </div>
  );
}
