"use client";

import { useState, useEffect, useCallback } from "react";
import { EventList } from "@/components/events/EventList";
// import axiosInstance from "@/lib/axios";
import { EventWithRelations } from "@/lib/types/utils_events";
// import { ErrorResponse } from "@/lib/types/routes";
// import ROUTES from "@/lib/routes/routes";
// import axios, { AxiosError } from "axios";
import { useGetCountriesQuery } from "@/redux/services/countriesApi"; //
import { getErrorMessage } from "@/lib/errors/utils"; //
import { EventFilter } from "@/components/events/EventFilter";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useEvents } from "@/hooks/useEvents";
import { ErrorMessage } from "@/components/common/ErrorMessage";

export default function ExplorationPage() {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  // const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  // const [countryError, setCountryError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [events, setEvents] = useState<EventWithRelations[]>([]);

  const {
    data: fetchedEvents,
    loading,
    error,
    fetchEvents,
    hasMore,
  } = useEvents({
    type: "upcoming",
    options: {
      onlineOnly: showOnlineOnly,
      country: selectedCountry,
      page,
      onError: (err) => console.error(err),
    },
  });

  // fetch all countries available in database - on mount !
  const { data: availableCountries = [], error: countriesError } = useGetCountriesQuery();

  // const fetchCountries = useCallback(async () => {
  //   try {
  //     const response = await axiosInstance.get(ROUTES.ALL_COUNTRIES);
  //     setAvailableCountries(response.data);
  //   } catch (error: unknown) {
  //     if (axios.isAxiosError(error)) {
  //       const axiosError = error as AxiosError<ErrorResponse>;
  //       if (axiosError.response?.data) {
  //         setCountryError(axiosError.response.data.message);
  //       } else {
  //         setCountryError("Failed to fetch events");
  //       }
  //     } else {
  //       setCountryError("An unexpected error occurred");
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchCountries();
  // }, [fetchCountries]);

  // when filter change, reset page and events, then fetch first page
  useEffect(() => {
    setPage(1);
    setEvents([]); // clear accumulated events
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showOnlineOnly, selectedCountry]);

  // When page or fetchedEvents change, update accumulated events
  useEffect(() => {
    if (page === 1) {
      setEvents(fetchedEvents as EventWithRelations[]);
    } else if (fetchedEvents && Array.isArray(fetchedEvents)) {
      setEvents((prev) => [...prev, ...(fetchedEvents as EventWithRelations[])]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedEvents, page]);

  // handler load More
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  };

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

      {/* Error States */}
      {error && <ErrorMessage error={error} />}
      {countriesError && <ErrorMessage error={getErrorMessage(countriesError)} />}

      {/* Events List */}
      {!loading && !error && <EventList events={events} />}

      {/* Load More Button */}
      {!loading && !error && (
        <div className="container mx-auto p-4 text-center">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="rounded bg-terracotta-600 px-6 py-2 text-white hover:bg-terracotta-700 disabled:opacity-50"
            >
              {loading ? (
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
