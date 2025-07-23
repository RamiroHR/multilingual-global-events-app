"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useGetEventDetailsQuery, useJoinEventMutation } from "@/redux/services/eventDetailsApi";
import { getEventError, getJoinEventError } from "@/lib/errors/utils";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EventDetailsHeader } from "@/components/events/EventDetailsHeader";
import { EventDetailsInfo } from "@/components/events/EventDetailsInfo";
import { EventDetailsActions } from "@/components/events/EventDetailsActions";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { EventWithRelations } from "@/lib/types/utils_events";
import { ApplicationStatus } from "@/lib/types";

export default function EventDetailsPage({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [hasApplied, setHasApplied] = useState(false);
  const [currentUserStatus, setCurrentUserStatus] = useState<ApplicationStatus | undefined>(
    undefined
  );

  // Fetch event details
  const { data: event, isLoading, error } = useGetEventDetailsQuery({ eventId: params.eventId });

  // Update local states
  useEffect(() => {
    if (user && event) {
      const currentUser = event.participants.find(
        (p: EventWithRelations["participants"][0]) =>
          p.user.id === Number(user?.id) &&
          (p.status === "PENDING" || p.status === "ACCEPTED" || p.status === "REJECTED")
      );
      setHasApplied(!!currentUser);
      setCurrentUserStatus(currentUser?.status as ApplicationStatus | undefined);
    }
  }, [user, event]);

  // Join event fetch function and associated states
  const [joinEvent, { isLoading: isJoining, error: joinError }] = useJoinEventMutation();

  // Join event logic
  const handleJoinEvent = useCallback(async () => {
    try {
      // the mutation service automatically refetches 'event'.
      await joinEvent({ eventId: params.eventId }).unwrap();
    } catch (error) {
      console.error("Failed to join event", error);
    }
  }, [params.eventId, joinEvent]);

  // computed reserved seats (not available)
  const reservedSeats = useMemo(() => {
    return event?.participants.filter((p) => p.status === "ACCEPTED" || p.status === "PENDING")
      .length;
  }, [event]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage error={getEventError(error) || "Event not found"} />
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
              participantsCount={reservedSeats || 0}
              maxCapacity={event.maxCapacity}
              status={currentUserStatus}
              showParticipants={true}
            />

            {/* Action Buttons */}
            <EventDetailsActions
              hasApplied={hasApplied}
              status={currentUserStatus}
              isFull={(reservedSeats || 0) >= event.maxCapacity}
              spotsLeft={event.maxCapacity - (reservedSeats || 0)}
              onJoinEvent={handleJoinEvent}
              error={getJoinEventError(joinError)}
              isJoining={isJoining}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
