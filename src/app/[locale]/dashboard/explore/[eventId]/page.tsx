"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import axiosInstance from "@/lib/axios";
import axios, { AxiosError } from "axios";
import { EventWithRelations } from "@/lib/types/utils_events";
import { ErrorResponse } from "@/lib/types/routes";
import ROUTES from "@/lib/routes/routes";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EventDetailsHeader } from "@/components/events/EventDetailsHeader";
import { EventDetailsInfo } from "@/components/events/EventDetailsInfo";
import { EventDetailsActions } from "@/components/events/EventDetailsActions";
import { ApplicationStatus } from "@/lib/types";

export default function EventDetailsPage({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const { user } = useAuthStore();

  const [event, setEvent] = useState<EventWithRelations>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [currentUserStatus, setCurrentUserStatus] = useState<ApplicationStatus | undefined>(
    undefined
  );

  const fetchEvent = useCallback(async () => {
    try {
      const response = await axiosInstance.get<EventWithRelations>(
        ROUTES.DETAIL_EVENT(params.eventId)
      );
      setEvent(response.data);

      // Check if the current user has already applied
      if (user?.id) {
        const currentUser = response.data.participants.find(
          (p: EventWithRelations["participants"][0]) =>
            p.user.id === Number(user?.id) &&
            (p.status === "PENDING" || p.status === "ACCEPTED" || p.status === "REJECTED")
        );
        setHasApplied(!!currentUser);
        setCurrentUserStatus(currentUser?.status as ApplicationStatus | undefined);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to fetch event details");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [params.eventId, user?.id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const handleJoinEvent = useCallback(async () => {
    try {
      // apply to event logic
      setLoading(true);
      setError("");
      await axiosInstance.post(ROUTES.APPLY_EVENT(params.eventId));
      setHasApplied(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.status === 409) {
          setError(
            "The event was modified by another user. Please refresh the page and try again."
          );
        } else if (axiosError.response?.data) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to join the event. Please try again later.");
        }
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  }, [params.eventId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md bg-terracotta-100 p-4 text-terracotta-800">
          {error || "Event not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-300">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex  text-terracotta-500 hover:text-terracotta-500/70"
        >
          ← Back
        </button>

        {/* Event Details Card */}
        <div className="overflow-hidden rounded-lg border border-lunar-200 bg-gray-50 shadow-lg">
          <div className="p-8">
            {/* Header */}
            <EventDetailsHeader title={event.title} creator={event.creator.username} />

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-2 text-xl font-semibold text-space-200">Description</h2>
              <p className="text-space-300">{event.description}</p>
            </div>

            {/* Event Details */}
            <EventDetailsInfo
              date={event.date}
              endDate={event.endDate}
              isOnline={event.isOnline}
              webinar={event.webinar}
              location={event.location}
              city={event.city}
              country={event.country}
              participantsCount={event.participants.length}
              maxCapacity={event.maxCapacity}
              status={currentUserStatus}
              showParticipants={true}
            />

            {/* Action Buttons */}
            <EventDetailsActions
              hasApplied={hasApplied}
              status={currentUserStatus}
              isFull={event.participants.length >= event.maxCapacity}
              spotsLeft={event.maxCapacity - event.participants.length}
              onJoinEvent={handleJoinEvent}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
