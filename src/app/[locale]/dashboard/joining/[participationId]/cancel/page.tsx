"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";
import ROUTES from "@/lib/routes/routes";
import { ApplicationWithRelations } from "@/lib/types/utils_applications";
import { ErrorResponse } from "@/lib/types/routes";
import { ConfirmationModal } from "@/components/common/ConfirmationModal";

export default function CancelParticipation({ params }: { params: { participationId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventLoading, setEventLoading] = useState(false);

  const fetchParticipation = useCallback(async () => {
    setEventLoading(true);
    try {
      // Artificial delay for testing spinnner
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
      const response = await axiosInstance.get<ApplicationWithRelations>(
        ROUTES.PARTICIPATION_ID(params.participationId)
      );
      setEventTitle(response.data.event.title);
      setError(null);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to load event");
        }
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error fetching participationor:", error);
    } finally {
      setEventLoading(false);
    }
  }, [params.participationId]);

  useEffect(() => {
    if (params.participationId) fetchParticipation();
  }, [fetchParticipation, params.participationId]);

  const handleCancel = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.delete<ApplicationWithRelations>(
        ROUTES.CANCEL_PARTICIPATION(params.participationId)
      );
      router.push("/dashboard/joining");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to cancel application.");
        }
      } else {
        setError("An unexpected error ocurred.");
      }
      console.error("Error canceling participation:", error);
    } finally {
      setLoading(false);
    }
  }, [router, params.participationId]);

  const handleKeep = useCallback(() => {
    router.push("/dashboard/joining");
  }, [router]);

  return (
    <ConfirmationModal
      title="Are you sure you want to cancel your participation?"
      eventTitle={eventTitle}
      isLoading={eventLoading}
      error={error}
      primaryAction={{
        label: "Yes, cancel my spot",
        onClick: handleCancel,
        isLoading: loading,
      }}
      secondaryAction={{
        label: "No, keep my spot!",
        onClick: handleKeep,
      }}
    >
      <p className="text-center">
        By canceling your participation, you will not be able to attend this event.
      </p>
    </ConfirmationModal>
  );
}
