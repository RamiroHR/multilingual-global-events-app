"use client";

import { QuickStatsCard } from "@/components/dashboard/QuickStatsCard";
import { useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "@/lib/axios";
import axios, { AxiosError } from "axios";
import ROUTES from "@/lib/routes/routes";
import { EventWithRelations, Application, ErrorResponse } from "@/lib/types";
import { NextEventCard } from "@/components/events/NextEventCard";
import { ApplicationCard } from "@/components/events/ApplicationCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useAuthStore } from "@/store/authStore";
import { CalendarCheck, Sparkles, Users } from "lucide-react";
import { CalendarPreview } from "@/components/dashboard/CalendarPreview";

export default function DashboardHome() {
  const { user } = useAuthStore();

  const [events, setEvents] = useState<EventWithRelations[]>([]);
  const [activities, setActivities] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      // fetch all events hosted by the user
      const hostingResponse = await axiosInstance(
        ROUTES.USER_EVENTS({ timeFilter: "all", orderBy: "desc" })
      );
      setEvents(hostingResponse.data);

      // fetch all activities the user participates
      const activityResponse = await axiosInstance(ROUTES.USER_PARTICIPATIONS);
      setActivities(activityResponse.data);
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // filtered events and activities
  const {
    futureHostedEvents,
    pastHostedEvents,
    nextEvent,
    futureActivities,
    pastActivities,
    nextActivity,
  } = useMemo(() => {
    const now = new Date();
    const futureHosted = events.filter((event) => new Date(event.date) > now);
    const pastHosted = events.filter((event) => new Date(event.date) <= now);
    const upcomingHostedEvent = futureHosted[0];

    const futureActivities = activities
      .filter((activity) => new Date(activity.event.date) > now && activity.status === "ACCEPTED")
      .sort((a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime());
    const pastActivities = activities
      .filter((activity) => new Date(activity.event.date) <= now)
      .sort((a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime());
    const upcomingActivity = futureActivities[0];

    return {
      futureHostedEvents: futureHosted,
      pastHostedEvents: pastHosted,
      nextEvent: upcomingHostedEvent,
      futureActivities: futureActivities,
      pastActivities: pastActivities,
      nextActivity: upcomingActivity,
    };
  }, [events, activities]);

  // metrics & stats object
  const stats = useMemo(
    () => ({
      futureHostedCount: futureHostedEvents.length,
      pastHostedCount: pastHostedEvents.length,
      totalParticipantsHosted: pastHostedEvents.reduce(
        (acc, event) => acc + event.participants.filter((p) => p.status === "ACCEPTED").length,
        0
      ),
      totalPendingApplications: futureHostedEvents.reduce(
        (acc, event) => acc + event.participants.filter((p) => p.status === "PENDING").length,
        0
      ),
      futureActivitiesCount: futureActivities.length,
      pastActivitiesCount: pastActivities.length,
    }),
    [futureHostedEvents, pastHostedEvents, futureActivities, pastActivities]
  );

  if (loading) {
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="rounded-lg bg-gradient-to-r from-space-300 to-terracotta-900 p-6">
        <h1 className="text-2xl font-bold text-white">
          Welcome back {user?.firstName || "there"}!
        </h1>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <QuickStatsCard
            title="Activities Joined"
            value={stats.pastActivitiesCount}
            icon={<CalendarCheck className="size-6" />}
          />
          <QuickStatsCard
            title="Events Hosted"
            value={stats.pastHostedCount}
            icon={<Sparkles className="size-6" />}
          />
          <QuickStatsCard
            title="People Brought Together"
            value={stats.totalParticipantsHosted}
            icon={<Users className="size-6" />}
          />
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Upcoming Events */}
        <section className="space-y-6 lg:col-span-2">
          {/* Next Activity Section */}
          <div className="rounded-lg bg-space-200 p-6">
            <h2 className="mb-4 text-xl font-semibold text-terracotta-800">Upcoming activity:</h2>
            <div className="space-y-4">
              {nextActivity ? (
                <>
                  <p className="text-lunar-300">Get ready for your next activity: </p>
                  <ApplicationCard
                    applicationId={nextActivity.id}
                    event={nextActivity.event}
                    applicationStatus={nextActivity.status}
                  />
                </>
              ) : (
                <p className="text-lunar-300">You have not subscribed to any activity yet</p>
              )}
            </div>
          </div>

          {/* Next Event Hosting Section */}
          <div className="rounded-lg bg-space-200 p-6">
            <h2 className="mb-4 text-xl font-semibold text-terracotta-800">
              Upcoming Hosting Event
            </h2>
            {/* Next Event Card */}
            <div className="space-y-4">
              {nextEvent ? (
                <>
                  <p className="text-lunar-300">You are soon hosting this event:</p>
                  <NextEventCard event={nextEvent} />
                </>
              ) : (
                <p className="text-lunar-300">You are not hosting any future event yet</p>
              )}
            </div>
          </div>
        </section>

        {/* Right Column - Sidebar */}
        <section className="space-y-6">
          <div className="rounded-lg bg-space-200 p-6">
            <h2 className="mb-4 text-xl font-semibold text-terracotta-800">Quick Remainders</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li className="text-lunar-300">
                {`Your are hosting ${stats.futureHostedCount} future events!`}
              </li>
              <li className="text-lunar-300">
                {`Your have ${stats.futureActivitiesCount} coming activities!`}
              </li>
            </ul>
          </div>

          <div className="rounded-lg bg-space-200 p-6">
            <h2 className="mb-4 text-xl font-semibold text-terracotta-800">Pending Reviews</h2>
            <p className="text-lunar-300">
              Your have {stats.totalPendingApplications} users awaiting for your reply.
            </p>
          </div>

          {/* <div className="rounded-lg bg-space-200 p-6">
            <h2 className="mb-4 text-xl font-semibold text-terracotta-800">Calendar Preview</h2>
            <p className="text-lunar-300">Your upcoming events calendar will appear here.</p>
          </div> */}
          <div className="rounded-lg bg-space-200 p-6">
            <h2 className="mb-4 text-xl font-semibold text-terracotta-800">Calendar Preview</h2>
            <CalendarPreview
              futureHostedEvents={futureHostedEvents}
              futureActivities={futureActivities}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
