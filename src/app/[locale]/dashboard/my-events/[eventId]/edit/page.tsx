"use client";

import { useCallback } from "react";
import { EditEventForm } from "@/components/events/EditEventForm";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useGetEventDetailsQuery } from "@/redux/services/eventDetailsApi"; //
import { getEventError } from "@/lib/errors/utils";

export default function EditEventPage({ params }: { params: { eventId: string } }) {
  const router = useRouter();

  const {
    data: event,
    isLoading: loading,
    error,
  } = useGetEventDetailsQuery({ eventId: params.eventId });

  const handleSuccess = useCallback(() => {
    router.push("/dashboard/my-events");
  }, [router]);

  const handleCancel = useCallback(() => {
    localStorage.removeItem("form_edit-event-form"); // Clear the saved form data
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

      {error && <ErrorMessage error={getEventError(error) || "Something went wrong."} />}
    </>
  );
}
