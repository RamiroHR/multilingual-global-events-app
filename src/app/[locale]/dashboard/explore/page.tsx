"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { EventList } from "@/components/events/EventList";
import axiosInstance from "@/lib/axios";
import { EventWithRelations } from "@/lib/types/utils_events";
import { ErrorResponse } from "@/lib/types/routes";
import ROUTES from "@/lib/routes/routes";
import axios, { AxiosError } from "axios";

export default function ExplorationPage() {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [events, setEvents] = useState<EventWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // get upcoming events
      const response = await axiosInstance.get<EventWithRelations[]>(ROUTES.UPCOMING_EVENTS);
      setEvents(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to fetch events");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []); // nuild function only once at first render

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Filter online events only
  const handleFilterChange = useCallback((checked: boolean) => {
    setShowOnlineOnly(checked);
  }, []);

  const displayedEvents = useMemo(() => {
    return showOnlineOnly ? events.filter((event) => event.isOnline) : events;
  }, [events, showOnlineOnly]);

  return (
    <div className="min-h-screen rounded bg-space-300">
      {/* Title Section */}
      <div className=" bg-space-300">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-terracotta-800">Explore Events</h1>
          <p className="mt-2 text-lunar-200">
            Discover and join exciting events from around the world
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="rounded bg-gradient-to-r from-space-300 to-terracotta-900 shadow-sm">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-end space-x-4">
            <label className="flex items-center space-x-2 text-space-200">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => handleFilterChange(e.target.checked)}
                className="rounded border-lunar-300 text-cosmic-500 focus:ring-cosmic-500"
              />
              <span>Show online events only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="size-8 animate-spin rounded-full border-b-2 border-cosmic-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="container mx-auto p-4">
          <div className="rounded-md bg-terracotta-100 p-4 text-terracotta-800">{error}</div>
        </div>
      )}

      {/* Events List */}
      {!loading && !error && <EventList events={displayedEvents} />}
    </div>
  );
}
