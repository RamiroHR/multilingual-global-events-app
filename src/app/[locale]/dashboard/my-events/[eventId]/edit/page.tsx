"use client";

import { useEffect, useState, useCallback } from "react";
import { EditEventForm } from "@/components/events/EditEventForm";
import axiosInstance from "@/lib/axios";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ErrorResponse, EventWithRelations } from "@/lib/types";
import ROUTES from "@/lib/routes/routes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";

export default function EditEventPage({ params }: { params: { eventId: string } }) {
  const router = useRouter();

  const [event, setEvent] = useState<EventWithRelations>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await axiosInstance.get<EventWithRelations>(
        ROUTES.DETAIL_EVENT(params.eventId)
      );
      setEvent(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching the event details:", error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to load event details.");
        }
      } else {
        setError("An unexpected error occurred while loading the event details.");
      }
      console.error("Error fetching the event details:", error);
    } finally {
      setLoading(false);
    }
  }, [params.eventId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleSuccess = useCallback(() => {
    router.push("/dashboard/my-events");
  }, [router]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <>
      <EditEventForm event={event} onSuccess={handleSuccess} onCancel={handleCancel} />

      {error && <ErrorMessage error={error} />}
    </>
  );
}
