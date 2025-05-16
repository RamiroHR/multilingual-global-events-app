"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { EventOwnerCard } from "@/components/events/EventOwnerCard";
import { CreateEventForm } from "@/components/events/CreateEventForm";
import { getUserEvents } from "@/lib/events/utils";

export default function MyEventsPage() {
  const [events, setEvents] = useState<
    Awaited<ReturnType<typeof getUserEvents>> // define the exact type as of what getUserEvents returns
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/events/my-events", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEvents(response.data);
      setError("");
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
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

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    fetchEvents(); // Refresh the events list
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
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
        <h1 className="mb-2 text-2xl font-bold text-terracotta-800">
          My Events
        </h1>
        <p className="mb-6 text-lunar-200">
          Create and manage events that your are hosting!
        </p>
        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
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
