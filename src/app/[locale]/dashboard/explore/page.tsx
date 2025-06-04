"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { EventList } from "@/components/events/EventList";
import axiosInstance from "@/lib/axios";
import { EventWithRelations } from "@/lib/types/utils_events";
import { ErrorResponse, EventsResponse } from "@/lib/types/routes";
import ROUTES from "@/lib/routes/routes";
import axios, { AxiosError } from "axios";
import { EventFilter } from "@/components/events/EventFilter";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function ExplorationPage() {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [events, setEvents] = useState<EventWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // state for pagination loading
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [availableCountries, setAvailableCountries] = useState<string[]>([]);

  const isFetching = useRef(false);

  // fetch all countries available in database
  const fetchCountries = useCallback(async () => {
    try {
      const response = await axiosInstance.get(ROUTES.ALL_COUNTRIES);
      setAvailableCountries(response.data);
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
    }
  }, []);

  // fetch event with filters
  const fetchEvents = useCallback(
    async (pageNum = 1) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true); // Set loadingMore true when fetching additional pages
        }
        setError(null);
        isFetching.current = true;

        // get upcoming events - paginated
        // const response = await axiosInstance.get<EventsResponse>(ROUTES.UPCOMING_EVENTS(pageNum));
        const response = await axiosInstance.get<EventsResponse>(
          ROUTES.UPCOMING_EVENTS(pageNum, {
            onlineOnly: showOnlineOnly,
            country: selectedCountry || undefined,
          })
        );

        if (pageNum === 1) {
          setEvents(response.data.events);
        } else {
          setEvents((prev) => [...prev, ...response.data.events]);
        }

        setHasMore(response.data.hasMore);
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
        setLoadingMore(false);
        isFetching.current = false;
      }
    },
    [showOnlineOnly, selectedCountry]
  );

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // Reset & fetch events when filters change
  useEffect(() => {
    setPage(1);
    fetchEvents(1);
  }, [showOnlineOnly, selectedCountry, fetchEvents]);

  // Load more events
  useEffect(() => {
    if (page > 1) {
      fetchEvents(page);
    }
  }, [page, fetchEvents]);

  // Filter handlers
  const handleFilterChange = useCallback((checked: boolean) => {
    setShowOnlineOnly(checked);
  }, []);

  const handleCountryChange = useCallback((country: string | null) => {
    setSelectedCountry(country);
  }, []);

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
      <EventFilter
        showOnlineOnly={showOnlineOnly}
        onFilterChange={handleFilterChange}
        selectedCountry={selectedCountry}
        onCountryChange={handleCountryChange}
        availableCountries={availableCountries}
      />

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Error State */}
      {error && (
        <div className="container mx-auto p-4">
          <div className="rounded-md bg-terracotta-100 p-4 text-terracotta-800">{error}</div>
        </div>
      )}

      {/* Events List */}
      {!loading && !error && <EventList events={events} />}

      {/* Load More Button */}
      {!loading && !error && (
        <div className="container mx-auto p-4 text-center">
          {hasMore ? (
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loadingMore}
              className="rounded bg-terracotta-600 px-6 py-2 text-white hover:bg-terracotta-700 disabled:opacity-50"
            >
              {loadingMore ? (
                <span className="flex items-center">
                  <LoadingSpinner />
                  <span className="ml-2">Loading...</span>
                </span>
              ) : (
                "Load More Events"
              )}
            </button>
          ) : (
            <p className="text-lunar-200">No more upcoming events to load</p>
          )}
        </div>
      )}
    </div>
  );
}
