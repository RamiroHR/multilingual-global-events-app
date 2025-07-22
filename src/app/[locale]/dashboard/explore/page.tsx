"use client";

import { useState, useEffect, useCallback } from "react";
import { EventList } from "@/components/events/EventList";
import { EventWithRelations } from "@/lib/types/utils_events";
import { useGetCountriesQuery } from "@/redux/services/countriesApi";
import { useLazyGetUpcomingEventsQuery } from "@/redux/services/eventsApi";
import { getErrorMessage } from "@/lib/errors/utils";
import { EventFilter } from "@/components/events/EventFilter";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

export default function ExplorationPage() {
  const [page, setPage] = useState(1);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [events, setEvents] = useState<EventWithRelations[]>([]);

  // fetch all countries available in database - on mount !
  const { data: availableCountries = [], error: countriesError } = useGetCountriesQuery();

  // lazy query hook to fetch events on trigger and destructured variables
  const [trigger, result] = useLazyGetUpcomingEventsQuery();
  const { data: eventsData, isLoading, error } = result;
  const fetchedEvents = eventsData?.events;
  const hasMore = eventsData?.hasMore;

  // Update page 1 events when filters change
  useEffect(() => {
    setPage(1);
    setEvents([]);
    trigger({ page: 1, onlineOnly: showOnlineOnly, country: selectedCountry });
  }, [showOnlineOnly, selectedCountry, trigger]);

  // Append new fetched events (NO duplicates) when page changes (fetching more events)
  useEffect(() => {
    if (fetchedEvents && fetchedEvents.length > 0) {
      // Only append events that we don't already have (discard by comparing IDs)
      const existingEventIds = new Set(events.map((event) => event.id));
      const newEvents = fetchedEvents.filter((event) => !existingEventIds.has(event.id));

      if (newEvents.length > 0) {
        if (page === 1) {
          setEvents(fetchedEvents);
        } else {
          setEvents((prev) => [...prev, ...newEvents]);
        }
      }
    }
  }, [fetchedEvents, page, events]);

  // handler "Load More"
  const handleLoadMore = () => {
    const nextPage = page + 1;
    if (hasMore && !isLoading) {
      setPage(nextPage);
      trigger({ page: nextPage, onlineOnly: showOnlineOnly, country: selectedCountry });
    }
  };

  // Filter handlers passed as props
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
      {isLoading && <LoadingSpinner />}

      {/* Error States */}
      {error && <ErrorMessage error={getErrorMessage(error)} />}
      {countriesError && <ErrorMessage error={getErrorMessage(countriesError)} />}

      {/* Events List */}
      {!isLoading && !error && <EventList events={events ?? []} />}

      {/* Load More Button */}
      {!isLoading && !error && (
        <div className="container mx-auto p-4 text-center">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="rounded bg-terracotta-600 px-6 py-2 text-white hover:bg-terracotta-700 disabled:opacity-50"
            >
              {isLoading ? (
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
