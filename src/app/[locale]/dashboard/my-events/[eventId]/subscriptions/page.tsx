"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "@/lib/axios";
import axios, { AxiosError } from "axios";
import ROUTES from "@/lib/routes/routes";
import { UserApplication } from "@/components/applications/UserApplication";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";
import {
  ApplicationWithInfo,
  ApplicationWithRelations,
  ErrorResponse,
  EventWithRelations,
} from "@/lib/types";

export default function ManageSubscriptions({ params }: { params: { eventId: string } }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<EventWithRelations>();
  const [eventTitle, setEventTitle] = useState("");
  const [eventLoading, setEventLoading] = useState(false);
  const [applications, setApplications] = useState<ApplicationWithInfo[]>([]);

  const fetchApplications = useCallback(async () => {
    try {
      const responseApplications = await axiosInstance.get<ApplicationWithInfo[]>(
        ROUTES.EVENT_APPLICATIONS(params.eventId)
      );
      setApplications(responseApplications.data);
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to fetch the event applications");
        }
      } else {
        setError("An unexpected error occurred while fetching the event applications");
      }
      console.error("Error fetching event applications:", error);
    } finally {
      setLoading(false);
    }
  }, [params.eventId]);

  const fetchEvent = useCallback(async () => {
    setEventLoading(true);
    try {
      const responseEvent = await axiosInstance.get<EventWithRelations>(
        ROUTES.DETAIL_EVENT(params.eventId)
      );
      setEvent(responseEvent.data);
      setEventTitle(responseEvent.data.title);
      setError(null);
      await fetchApplications();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to fetch event.");
        }
      } else {
        setError("An unexpected error occurred while fetching the event");
      }
      console.error("Error while fetching event", error);
    } finally {
      setEventLoading(false);
    }
  }, [params.eventId, fetchApplications]);

  useEffect(() => {
    if (params.eventId) fetchEvent();
  }, [params.eventId, fetchApplications, fetchEvent]);

  // sort applications to see new first, and cancelled at the end
  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => {
      //sort by NOT CANCELLED, then CANCELLED
      if (a.status === "CANCELLED" && b.status !== "CANCELLED") return 1; // a(CANECLLED goes to the end)
      if (a.status !== "CANCELLED" && b.status === "CANCELLED") return -1; // b(CANECLLED goes to the end)

      // then, in each subgroup, sort by updated date (newest first)
      return new Date(b.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    });
  }, [applications]);

  const countSeats = useMemo(() => {
    const takenSeats = applications.filter(
      (application) => application.status === "ACCEPTED"
    ).length;

    return (event?.maxCapacity ?? 0) - takenSeats;
  }, [applications, event]);

  const handleAccept = useCallback(
    async (applicationId: number) => {
      try {
        setLoading(true);
        setError("");
        await axiosInstance.patch<ApplicationWithRelations>(
          ROUTES.REVIEW_APPLICATION(applicationId),
          { status: "ACCEPTED" }
        );
        await fetchApplications();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (axiosError.response?.data) {
            setError(axiosError.response.data.message);
          } else {
            setError("Failed to update application status");
          }
        } else {
          setError("An unexpected error occurred while updating the application status");
        }
        console.error("Error reviewing the user application: ", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchApplications]
  );

  const handleReject = useCallback(
    async (applicationId: number) => {
      try {
        setLoading(true);
        setError("");
        await axiosInstance.patch<ApplicationWithRelations>(
          ROUTES.REVIEW_APPLICATION(applicationId),
          { status: "REJECTED" }
        );
        await fetchApplications();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (axiosError.response?.data) {
            setError(axiosError.response.data.message);
          } else {
            setError("Failed to update application status");
          }
        } else {
          setError("An unexpected error occurred while updating the application status");
        }
        console.error("Error reviewing the user application: ", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchApplications]
  );

  const handleContinue = useCallback(() => {
    // router.push("/dashboard/my-events");
    router.back();
  }, [router]);

  return (
    <ConfirmationModal
      title="The following users want to join your event"
      eventTitle={eventTitle}
      isLoading={eventLoading}
      error={error}
      secondaryAction={{
        label: "Continue",
        onClick: handleContinue,
      }}
    >
      <div>
        {/* Available Seats */}
        {!eventLoading && <p className="mb-4 text-center">{`Remaining seats: ${countSeats}`}</p>}

        {/* List of applications requests */}
        <div className="flex flex-col">
          {sortedApplications.map((application) => (
            <UserApplication
              key={application.id}
              application={application}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>

        {/* No applications state */}
        {!loading && applications.length === 0 && (
          <p className="text-center text-lunar-300">No applications yet</p>
        )}
      </div>
    </ConfirmationModal>
  );
}
