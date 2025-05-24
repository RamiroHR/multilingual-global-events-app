import { Event, User } from "@prisma/client";
import { format } from "date-fns";
import { MapPin, Users, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

interface ApplicationCardProps {
  applicationId: number;
  event: Event & {
    creator: User;
    participants: {
      id: number;
      status: string;
      user: User;
    }[];
  };
  applicationStatus: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
}

export const ApplicationCard = ({
  applicationId,
  event,
  applicationStatus,
}: ApplicationCardProps) => {
  const router = useRouter();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          border: "border-lunar-200",
          bg: "bg-lunar-50",
          text: "text-cosmic-500",
          accent: "border-l-4 border-l-cosmic-500",
          content: "text-space-100",
          detail: "text-space-100/50",
        };
      case "ACCEPTED":
        return {
          border: "border-lunar-200",
          bg: "bg-white-50",
          text: "text-terracotta-100",
          accent: "border-l-4 border-l-terracotta-500",
          content: "text-space-100",
          detail: "text-space-100/50",
        };
      case "REJECTED":
        return {
          border: "border-lunar-200",
          bg: "bg-space-50",
          text: "text-lunar-100",
          accent: "border-l-4 border-l-white-500",
          content: "text-lunar-100",
          detail: "text-lunar-100/50",
        };
      case "CANCELLED":
        return {
          border: "border-lunar-200",
          bg: "bg-space-50",
          text: "text-lunar-100",
          accent: "border-l-4 border-l-yellow-500",
          content: "text-lunar-100",
          detail: "text-lunar-100/50",
        };
      default:
        return {
          border: "border-lunar-200",
          bg: "bg-space-50",
          text: "text-lunar-100",
          accent: "",
          content: "text-space-100",
          detail: "text-space-100/50",
        };
    }
  };

  const styles = getStatusStyles(applicationStatus);

  return (
    <div
      className={`flex items-center justify-between rounded-lg
        border ${styles.border} ${styles.bg} ${styles.accent}
        p-4 shadow-sm transition-shadow hover:shadow-md`}
    >
      {/* Event Info Section */}
      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between">
          {/* title */}
          <h3 className={`text-lg font-semibold ${styles.text}`}>{event.title}</h3>
          {/* date */}
          <div className="flex flex-col items-end">
            <span className={`text-sm ${styles.detail}`}>
              {format(new Date(event.date), "PPP")}
            </span>
            {/* status */}
            <span className={`text-sm font-medium ${styles.text}`}>
              {applicationStatus.charAt(0) + applicationStatus.slice(1).toLowerCase()}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-space-300">
          {/* Location/Online Status */}
          <div className="flex items-center">
            {event.isOnline ? (
              <>
                <Globe className="mr-1 size-4 text-cosmic-500" />
                <span className={`${styles.content}`}>Online Event</span>
              </>
            ) : (
              <>
                <MapPin className="mr-1 size-4 text-cosmic-500" />
                <span className={`${styles.content}`}>{event.location}</span>
              </>
            )}
          </div>

          {/* Participants Count */}
          <div className="flex items-center">
            <Users className="mr-1 size-4 text-cosmic-500" />
            <span className={`${styles.content}`}>
              {event.participants.length} / {event.maxCapacity} participants
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="ml-4 flex flex-col gap-2">
        <button
          onClick={() => router.push(`/dashboard/explore/${event.id}`)}
          className="rounded-md bg-cosmic-500 px-4 py-2 text-white-50
            transition-colors hover:bg-cosmic-600"
        >
          View Details
        </button>
        <button
          onClick={() => router.push(`/dashboard/joining/${applicationId}/cancel`)}
          className="rounded-md bg-terracotta-500 px-4 py-2 text-white-50
            transition-colors hover:bg-cosmic-600"
        >
          Leave Event
        </button>
      </div>
    </div>
  );
};
