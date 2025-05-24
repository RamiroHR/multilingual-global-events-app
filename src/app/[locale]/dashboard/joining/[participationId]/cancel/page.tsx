"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export default function CancelParticipation({ params }: { params: { participationId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventLoading, setEventLoading] = useState(false);

  useEffect(() => {
    async function fetchParticipation() {
      setEventLoading(true);
      try {
        const response = await axiosInstance.get(`/api/participation/${params.participationId}`);
        setEventTitle(response.data.event.title);
      } catch (err) {
        console.error("Error fetching participation:", err);
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setEventLoading(false);
      }
    }
    if (params.participationId) fetchParticipation();
  }, [params.participationId]);

  const handleCancel = async () => {
    try {
      setLoading(true);
      setError("");
      await axiosInstance.delete(`/api/participation/${params.participationId}/cancel`);
      router.push("/dashboard/joining");
    } catch (err) {
      console.error("Error canceling participation:", err);
      setError("Failed to cancel the participation. Please try again later");
    } finally {
      setLoading(false);
    }
  };

  const handleKeep = () => {
    router.push("/dashboard/joining");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-participation-title"
    >
      <div className="max-h-[90vh] w-1/2 max-w-4xl overflow-y-auto rounded-lg bg-space-200 shadow-xl">
        <div className="w-full max-w-2xl p-8">
          <h2
            className="mb-4 text-center text-2xl font-bold text-terracotta-400"
            id="cancel-participation-title"
          >
            Are you sure you want to cancel your participation?
          </h2>

          {eventLoading ? (
            <h3 className="mb-8 text-center text-xl font-bold text-lunar-900">
              Loading event title...
            </h3>
          ) : (
            <h3 className="mb-8 text-center text-xl font-bold text-white">
              &quot;{eventTitle}&quot;
            </h3>
          )}

          <div>
            <p className="text-center">
              By canceling your participation, you will not be able to attend this event.
            </p>
          </div>

          {error && <p className="mt-4 text-center text-red-500">{error}</p>}

          <div className="mt-8 flex justify-center gap-4">
            <button
              className="rounded-md border border-terracotta-500/30 px-4 py-2 text-sm font-medium
                    text-terracotta-200 transition-colors hover:bg-space-400/40"
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? "Canceling..." : "Yes, cancel my spot"}
            </button>
            <button
              className="rounded-md bg-terracotta-500 px-6 py-2 text-sm font-medium text-space-100
                  transition-colors hover:bg-terracotta-400 focus:outline-none focus:ring-2
                  focus:ring-terracotta-400 focus:ring-offset-1 disabled:opacity-50"
              onClick={handleKeep}
              disabled={loading}
            >
              No, keep my spot!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
