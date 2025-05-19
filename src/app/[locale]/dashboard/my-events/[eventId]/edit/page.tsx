"use client";

import { useEffect, useState } from "react";
import { EditEventForm } from "@/components/events/EditEventForm";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function EditEventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/events/${params.eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEvent(response.data);
      } catch (error) {
        console.error("Error fetching event:", error);
        router.push("/dashboard/my-events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.eventId, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <EditEventForm
      event={event}
      onSuccess={() => router.push("/dashboard/my-events")}
      onCancel={() => router.back()}
    />
  );
}
