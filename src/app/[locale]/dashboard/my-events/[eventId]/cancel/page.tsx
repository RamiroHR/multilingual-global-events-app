"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import axios, { AxiosError } from "axios";
import ROUTES from "@/lib/routes/routes";
import { Event } from "@/lib/types";
import { ErrorResponse } from "@/lib/types/routes";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

export default function CancelEvent({ params }: { params: { eventId: string } }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventLoading, setEventLoading] = useState(false);
  const [eventVersion, setEventVersion] = useState<number | null>(null);

  const fetchEvent = useCallback(async () => {
    setEventLoading(true);
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const response = await axiosInstance.get<Event>(ROUTES.DETAIL_EVENT(params.eventId));
      setEventTitle(response.data.title);
      setEventVersion(response.data.version);
      setError(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to load event.");
        }
      } else {
        setError("An unexpected error occurred while loading the event.");
      }
      console.error("Error fetching the event:", error);
    } finally {
      setEventLoading(false);
    }
  }, [params.eventId]); // run when component mounts to get the event title

  useEffect(() => {
    if (params.eventId) fetchEvent();
  }, [params.eventId, fetchEvent]);

  const handleCancel = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.patch<Event>(ROUTES.CANCEL_EVENT(params.eventId), {
        version: eventVersion,
      });
      // router.push("/dashboard/my-events");
      router.back();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to cancel the event. Please try again later");
        }
      } else {
        setError("An unexpected error occurred while canceling the event");
      }
      console.error("Error canceling the event:", error);
    } finally {
      setLoading(false);
    }
  }, [params.eventId, router, eventVersion]);

  const handleKeep = useCallback(() => {
    // router.push("/dashboard/my-events");
    router.back();
  }, [router]);

  return (
    <ConfirmationModal
      title="Are you sure you want to cancel this event?"
      eventTitle={eventTitle}
      isLoading={eventLoading}
      error={error}
      primaryAction={{
        label: "Yes, cancel this event",
        onClick: handleCancel,
        isLoading: loading,
      }}
      secondaryAction={{
        label: "No, keep this event.",
        onClick: handleKeep,
      }}
    >
      {/* Indications */}
      <div>
        <p className="text-center">If you cancel the event, all participants will be notified.</p>
        <p className="text-center">
          The event will not be visible on your page and it will no longer be displayed on the
          Explore page.
        </p>
      </div>
    </ConfirmationModal>
  );
}
