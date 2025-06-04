import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ApplicationCardProps, ApplicationStatus } from "@/lib/types";

import { EventDetailsInfo } from "@/components/events/EventDetailsInfo";

export const ApplicationCard = ({
  applicationId,
  event,
  applicationStatus,
}: ApplicationCardProps) => {
  const router = useRouter();

  const getStatusStyles = useCallback((status: ApplicationStatus) => {
    const styles = {
      PENDING: {
        border: "border-lunar-200",
        bg: "bg-lunar-50",
        text: "text-cosmic-500",
        accent: "border-l-4 border-l-cosmic-500",
        content: "text-space-100",
        detail: "text-space-100/50",
      },
      ACCEPTED: {
        border: "border-lunar-200",
        bg: "bg-gray-50",
        text: "text-terracotta-100",
        accent: "border-l-4 border-l-terracotta-500",
        content: "text-space-100",
        detail: "text-space-100/50",
      },
      REJECTED: {
        border: "border-lunar-200",
        bg: "bg-space-50",
        text: "text-lunar-100",
        accent: "border-l-4 border-l-white-500",
        content: "text-lunar-100",
        detail: "text-lunar-100/50",
      },
      CANCELLED: {
        border: "border-lunar-200",
        bg: "bg-space-50",
        text: "text-yellow-500/80",
        accent: "border-l-4 border-l-yellow-500",
        content: "text-lunar-100",
        detail: "text-lunar-100/50",
      },
    };
    return styles[status];
  }, []);

  const styles = useMemo(
    () => getStatusStyles(applicationStatus),
    [applicationStatus, getStatusStyles]
  );

  const handleViewDetails = useCallback(() => {
    router.push(`/dashboard/explore/${event.id}`);
  }, [router, event.id]);

  const handleLeaveEvent = useCallback(() => {
    router.push(`/dashboard/joining/${applicationId}/cancel`);
  }, [router, applicationId]);

  return (
    <div
      className={`flex rounded-lg border ${styles.border} ${styles.bg} ${styles.accent}
    p-4 shadow-sm transition-shadow hover:shadow-md`}
    >
      {/* Left Column - Content */}
      <div className="flex-1">
        {/* Top Row - Title, Creator, Status */}
        <div className="flex items-baseline justify-between">
          <h3 className={`text-lg font-semibold ${styles.text}`}>{event.title}</h3>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${styles.detail}`}>by {event.creator.username}</span>
            <span className={`text-sm font-medium ${styles.text}`}>
              {applicationStatus.charAt(0) + applicationStatus.slice(1).toLowerCase()}
            </span>
          </div>
        </div>

        {/* Bottom Row - Event Details */}
        <div className="mt-2">
          <EventDetailsInfo
            date={event.date}
            endDate={event.endDate}
            isOnline={event.isOnline}
            webinar={event.webinar}
            location={event.location}
            city={event.city}
            country={event.country}
            participantsCount={event.participants.length}
            maxCapacity={event.maxCapacity}
            status={applicationStatus}
            showParticipants={false}
            textClassName={styles.detail}
          />
        </div>
      </div>

      {/* Right Column - Action Buttons */}
      <div className="ml-4 flex flex-col gap-2">
        <button
          onClick={handleViewDetails}
          className="w-fit rounded-md bg-cosmic-500 px-4 py-2 text-white-50
            transition-colors hover:bg-cosmic-600"
        >
          View Details
        </button>
        <button
          onClick={handleLeaveEvent}
          className="w-fit rounded-md bg-terracotta-500 px-4 py-2 text-white-50
            transition-colors hover:bg-terracotta-600"
        >
          Leave Event
        </button>
      </div>
    </div>
  );
};
