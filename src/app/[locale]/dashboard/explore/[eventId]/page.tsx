"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import axiosInstance from "@/lib/axios";
import { Event, User } from "@prisma/client";
import { format } from "date-fns";
import { Calendar, MapPin, Users, Globe } from "lucide-react";

type EventWithRelations = Event & {
  creator: User;
  participants: {
    id: number;
    status: string;
    user: User;
  }[];
};

export default function EventDetailsPage({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState<EventWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosInstance.get(`/api/events/${params.eventId}`);
        setEvent(response.data);

        // Check if the current user has already applied
        if (user?.id) {
          const currentUser = response.data.participants.find(
            (p: EventWithRelations["participants"][0]) =>
              p.user.id === Number(user?.id) &&
              (p.status === "PENDING" || p.status === "ACCEPTED" || p.status === "REJECTED")
          );
          setHasApplied(!!currentUser);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.eventId, user?.id]);

  const handleJoinEvent = async () => {
    try {
      // apply to event logic
      setLoading(true);
      setError("");
      await axiosInstance.post(`/api/events/${params.eventId}/apply`);
      setHasApplied(true);
    } catch (error) {
      // handle errors
      setError("Failed to join the event. Please try again later.");
      console.error("Error joining the event: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-cosmic-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-md bg-terracotta-100 p-4 text-terracotta-800">
          {error || "Event not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-300">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex  text-terracotta-500 hover:text-terracotta-500/70"
        >
          ← Back
        </button>

        {/* Event Details Card */}
        <div className="overflow-hidden rounded-lg border border-lunar-200 bg-gray-50 shadow-lg">
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-space-100">{event.title}</h1>
              <p className="mt-2 text-lunar-500">by {event.creator.username}</p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-2 text-xl font-semibold text-space-200">Description</h2>
              <p className="text-space-300">{event.description}</p>
            </div>

            {/* Event Details */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center text-space-300">
                <Calendar className="mr-2 size-5 text-cosmic-500" />
                <span>{format(new Date(event.date), "PPP p")}</span>
              </div>

              <div className="flex items-center text-space-300">
                {event.isOnline ? (
                  <>
                    <Globe className="mr-2 size-5 text-cosmic-500" />
                    <span>Online Event</span>
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 size-5 text-cosmic-500" />
                    <span>{event.location}</span>
                  </>
                )}
              </div>

              <div className="flex items-center text-space-300">
                <Users className="mr-2 size-5 text-cosmic-500" />
                <span>
                  {event.participants.length} / {event.maxCapacity} participants
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleJoinEvent}
                  className={`rounded-md px-6 py-3 text-white-50 transition-colors ${
                    event.participants.length >= event.maxCapacity || hasApplied
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-cosmic-500 hover:bg-cosmic-600"
                  }`}
                  disabled={event.participants.length >= event.maxCapacity || hasApplied}
                >
                  {event.participants.length >= event.maxCapacity ? "Event Full" : "Join Event"}
                </button>

                {hasApplied && (
                  <span className="text-red text-terracotta">
                    Your application was sent to the organizer!
                  </span>
                )}
              </div>

              <span className="text-sm">
                {event.participants.length === event.maxCapacity ? (
                  <span className="text-terracotta-500">Full</span>
                ) : (
                  <span className="text-cosmic-500">
                    {event.maxCapacity - event.participants.length} spots left
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
