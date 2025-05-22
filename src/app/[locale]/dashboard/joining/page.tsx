"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Event, User } from "@prisma/client";
import { ApplicationCard } from "@/components/events/ApplicationCard";

// Define the type for our application data
type Application = {
  id: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  event: Event & {
    creator: User;
    participants: {
      id: number;
      status: string;
      user: User;
    }[];
  };
};

export default function JoiningPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axiosInstance.get("/api/participation");
        setApplications(response.data);
      } catch (err) {
        setError("Failed to fetch applications");
        console.error("Error fetching applications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Group applications into active and inactive
  const activeApplications = applications
    .filter((app) => app.status === "ACCEPTED" || app.status === "PENDING")
    .sort(
      (a, b) =>
        new Date(a.event.date).getTime() - new Date(b.event.date).getTime()
    );

  const inactiveApplications = applications
    .filter((app) => app.status === "REJECTED" || app.status === "CANCELLED")
    .sort(
      (a, b) =>
        new Date(b.event.date).getTime() - new Date(a.event.date).getTime()
    );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-space-300">
          <p>Loading your applications...</p>
        </div>
      </div>
    );
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
      <h1 className="mb-8 text-3xl font-bold text-terracotta-400">
        My Applications
      </h1>

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
