import { useState, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import axios, { AxiosError } from "axios";
import { EventWithRelations } from "@/lib/types/utils_events";
import { Application } from "@/lib/types/utils_applications";
import { ErrorResponse, EventsResponse } from "@/lib/types/routes";
import { EventOptions, UseEventsReturn, EventData } from "@/lib/types/hooks";
import ROUTES from "@/lib/routes/routes";

export function useEvents(config: EventOptions): UseEventsReturn {
  const [data, setData] = useState<EventData>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // case-specific logic
      switch (config.type) {
        case "upcoming": {
          const response = await axiosInstance.get<EventsResponse>(
            ROUTES.UPCOMING_EVENTS(config.options?.page || 1, {
              onlineOnly: config.options?.onlineOnly,
              country: config.options?.country || undefined,
            })
          );
          setData(response.data.events);
          setHasMore(response.data.hasMore);
          break;
        }

        case "created": {
          const response = await axiosInstance.get<EventWithRelations[]>(
            ROUTES.USER_EVENTS({
              timeFilter: config.options?.timeFilter,
              orderBy: config.options?.orderBy,
            })
          );
          setData(response.data);
          break;
        }

        case "joined": {
          const response = await axiosInstance.get<Application[]>(ROUTES.USER_PARTICIPATIONS);
          setData(response.data);
          break;
        }
      }
    } catch (error) {
      //handle errors
      const errorMessage = handleError(error);
      setError(errorMessage);
      config.options?.onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [config]);

  return {
    data,
    loading,
    error,
    fetchEvents,
    ...(config.type === "upcoming" && { hasMore }),
  };
}

// Helper function to handle errors
function handleError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response?.data) {
      return axiosError.response.data.message;
    }
    return "Failed to fetch events";
  }
  return "An unespected error occurred";
}
