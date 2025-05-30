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

  const fetchEvent = useCallback(async () => {
    setEventLoading(true);
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const response = await axiosInstance.get<Event>(ROUTES.DETAIL_EVENT(params.eventId));
      setEventTitle(response.data.title);
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
      await axiosInstance.patch<Event>(ROUTES.CANCEL_EVENT(params.eventId));
      router.push("/dashboard/my-events");
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
  }, [params.eventId, router]);

  const handleKeep = useCallback(() => {
    router.push("/dashboard/my-events");
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

    // <div
    //   className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    //   role="dialog"
    //   aria-modal="true"
    //   aria-labelledby="cancel-event-title"
    // >
    //   <div className="max-h-[90vh] w-1/2 max-w-4xl overflow-y-auto rounded-lg bg-space-200 shadow-xl">
    //     <div className="w-full max-w-2xl p-8">
    //       {/* Confirmation Question & Event Title */}
    //       <h2
    //         className="mb-4 text-center text-2xl font-bold text-terracotta-400"
    //         id="cancel-event-title"
    //       >
    //         Are you sure you want to cancel this event?
    //       </h2>

    //       {eventLoading ? (
    //         <h3 className="mb-8 text-center text-xl font-bold text-lunar-900">
    //           Loading event title...
    //         </h3>
    //       ) : (
    //         <h3 className="mb-8 text-center text-xl font-bold text-white">
    //           &quot;{eventTitle}&quot;
    //         </h3>
    //       )}

    //       {/* Indications */}
    //       <div>
    //         <p className="text-center">
    //           If you cancel the event, all participants will be notified.
    //         </p>
    //         <p className="text-center">
    //           The event will not be visible on your page and it will no longer be displayed on the
    //           Explore page.
    //         </p>
    //       </div>

    //       {error && <p className="mt-4 text-center text-red-500">{error}</p>}

    //       {/* Action buttons */}
    //       <div className="mt-8 flex justify-between pt-4">
    //         <button
    //           className="rounded-md border border-terracotta-500/30 px-4 py-2 text-sm font-medium
    //                 text-terracotta-200 transition-colors hover:bg-space-400/40"
    //           onClick={handleCancel}
    //           disabled={loading}
    //         >
    //           {loading ? "Canceling..." : "Yes, cancel this event."}
    //         </button>
    //         <button
    //           className="rounded-md bg-terracotta-500 px-6 py-2 text-sm font-medium text-space-100
    //               transition-colors hover:bg-terracotta-400 focus:outline-none focus:ring-2
    //               focus:ring-terracotta-400 focus:ring-offset-1 disabled:opacity-50"
    //           onClick={handleKeep}
    //           disabled={loading}
    //         >
    //           No, keep this event.
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
