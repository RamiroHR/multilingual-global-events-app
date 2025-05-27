"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import ROUTES from "@/lib/routes/routes";
import { UserApplication } from "@/components/applications/UserApplication";

import { EventParticipant, Event } from "@prisma/client";

type EventApplication = EventParticipant & {
  user: {
    id: number;
    username: string;
    email: string;
  };
  event: {
    id: number;
    title: string;
    maxCapacity: number;
  };
};

export default function ManageSubscriptions({ params }: { params: { eventId: string } }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [event, setEvent] = useState<Event>();
  const [applications, setApplications] = useState<EventApplication[]>([]);
  const [eventLoading, setEventLoading] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      const responseApplications = await axiosInstance.get(
        ROUTES.EVENT_APPLICATIONS(params.eventId)
      );
      setApplications(responseApplications.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load applications");
    }
  }, [params.eventId]);

  // run when component mounts to get the event title
  useEffect(() => {
    async function fetchEvent() {
      setEventLoading(true);
      try {
        const responseEvent = await axiosInstance.get(ROUTES.DETAIL_EVENT(params.eventId));
        setEvent(responseEvent.data);
        await fetchApplications();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setEventLoading(false);
      }
    }
    if (params.eventId) fetchEvent();
  }, [params.eventId, fetchApplications]);

  const handleContinue = () => {
    router.push("/dashboard/my-events");
  };

  const countSeats = () => {
    const takenSeats = applications.filter(
      (application) => application.status === "ACCEPTED"
    ).length;

    return (event?.maxCapacity ?? 0) - takenSeats;
  };

  const handleAccept = async (applicationId: number) => {
    try {
      setLoading(true);
      setError("");
      await axiosInstance.patch(ROUTES.REVIEW_APPLICATION(applicationId), { status: "ACCEPTED" });
      await fetchApplications();
    } catch (error) {
      console.error("Error reviewing the user application: ", error);
      setError("Failed to accept the user application. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (applicationId: number) => {
    try {
      setLoading(true);
      setError("");
      await axiosInstance.patch(ROUTES.REVIEW_APPLICATION(applicationId), { status: "REJECTED" });
      await fetchApplications();
    } catch (error) {
      console.error("Error reviewing the user application: ", error);
      setError("Failed to reject the user application. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-subscriptions"
    >
      <div className="max-h-[90vh] w-[600px] overflow-y-auto rounded-lg bg-space-200 shadow-xl">
        <div className="p-8 text-center">
          {/* Confirmation Question & Event Title */}
          <h2 className="mb-4 text-2xl font-bold text-terracotta-400" id="cancel-event-title">
            These users want to join your event
          </h2>

          {eventLoading ? (
            <h3 className="mb-2 text-xl font-bold text-lunar-900">Loading event title...</h3>
          ) : (
            <h3 className="mb-2 text-xl font-bold text-white">&quot;{event?.title}&quot;</h3>
          )}

          {/* Indications */}
          <p className="mb-4">{`Remaining seats: ${countSeats()}`}</p>

          {/* List of applications requests */}
          <div className="flex flex-col">
            {applications.map((application) => (
              <UserApplication
                key={application.id}
                application={application}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>

          {error && <p className="mt-4 text-center text-red-500">{error}</p>}

          {/* Action buttons */}
          <div className="mt-4 flex justify-center pt-4">
            <button
              className="rounded-md bg-terracotta-500 px-6 py-2 text-sm font-medium text-space-100
                  transition-colors hover:bg-terracotta-400 focus:outline-none focus:ring-2
                  focus:ring-terracotta-400 focus:ring-offset-1 disabled:opacity-50"
              onClick={handleContinue}
              disabled={loading}
            >
              {loading ? "Reviewing..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
