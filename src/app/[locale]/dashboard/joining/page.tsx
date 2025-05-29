"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import axiosInstance from "@/lib/axios";
import axios, { AxiosError } from "axios";
import ROUTES from "@/lib/routes/routes";
import { ApplicationCard } from "@/components/events/ApplicationCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Application } from "@/lib/types";
import { ErrorResponse } from "@/lib/types/routes";

export default function JoiningPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchApplications = useCallback(async () => {
    try {
      const response = await axiosInstance.get<Application[]>(ROUTES.USER_PARTICIPATIONS);
      setApplications(response.data);
      setError(undefined);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data) {
          setError(axiosError.response.data.message);
        } else {
          setError("Failed to fetch applications");
        }
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Group applications into active and inactive
  const { activeApplications, inactiveApplications } = useMemo(() => {
    const active = applications
      .filter((app) => app.status === "ACCEPTED" || app.status === "PENDING")
      .sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime());

    const inactive = applications
      .filter((app) => app.status === "REJECTED" || app.status === "CANCELLED")
      .sort((a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime());

    return { activeApplications: active, inactiveApplications: inactive };
  }, [applications]);

  if (isLoading) {
    <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-space-300">
          <p className="text-terracotta-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-terracotta-400">My Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center text-white">
          <p>You haven&apos;t applied to any events yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Applications Section */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-white">
              Active Applications ({activeApplications.length})
            </h2>
            <div className="space-y-4">
              {activeApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  applicationId={application.id}
                  event={application.event}
                  applicationStatus={application.status}
                />
              ))}
            </div>
          </section>

          {/* Divider */}
          {inactiveApplications.length > 0 && (
            <div className="relative">
              <div className="absolute inset-0 mt-4 flex items-center">
                <div className="w-full border-t border-lunar-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="text-m mt-4 bg-space-300 px-4 text-lunar-500">
                  Closed Applications
                </span>
              </div>
            </div>
          )}

          {/* Inactive Applications Section */}
          {inactiveApplications.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold text-white">
                Inactive Applications ({inactiveApplications.length})
              </h2>
              <div className="space-y-4">
                {inactiveApplications.map((application) => (
                  <ApplicationCard
                    key={application.id}
                    applicationId={application.id}
                    event={application.event}
                    applicationStatus={application.status}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
