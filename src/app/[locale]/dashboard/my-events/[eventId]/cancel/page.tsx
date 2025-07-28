"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import { useGetEventDetailsQuery } from "@/redux/services/eventDetailsApi";
import { useCancelEventMutation } from "@/redux/services/eventDetailsApi";
import { getCancelEventError, getEventError } from "@/lib/errors/utils";

export default function CancelEvent({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const [cancelEvent, { isLoading: isCanceling, error: cancelError }] = useCancelEventMutation();

  // fetch event details
  const {
    data: event,
    isLoading: eventLoading,
    error: eventError,
  } = useGetEventDetailsQuery({ eventId: params.eventId });

  // handle cancel event with mutation
  const handleCancel = useCallback(async () => {
    try {
      await cancelEvent({ eventId: params.eventId, version: event?.version ?? 0 }).unwrap();
      router.back();
    } catch (error: unknown) {
      console.error("Error canceling the event:", error);
    }
  }, [cancelEvent, router, params.eventId, event]);

  // redirection flow
  const handleKeep = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <ConfirmationModal
      title="Are you sure you want to cancel this event?"
      eventTitle={event?.title || `<${getEventError(eventError)}>` || "{Something went wrong}"}
      isLoading={eventLoading}
      error={getCancelEventError(cancelError)}
      primaryAction={{
        label: "Yes, cancel this event",
        onClick: handleCancel,
        isLoading: isCanceling,
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
