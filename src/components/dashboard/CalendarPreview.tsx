import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Crown, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { CalendarProps, CalendarTile } from "@/lib/types/components";

export function CalendarPreview({ futureHostedEvents, futureActivities }: CalendarProps) {
  const router = useRouter();

  const getTileContent = ({ date }: CalendarTile) => {
    const dateString = date.toDateString();
    const hasEvent = futureHostedEvents.some(
      (event) => new Date(event.date).toDateString() === dateString
    );
    const hasActivity = futureActivities.some(
      (activity) => new Date(activity.event.date).toDateString() === dateString
    );

    if (!hasEvent && !hasActivity) return null;

    return (
      <div className="relative size-full">
        <div className="absolute inset-0 flex items-center justify-center">
          {hasEvent && <Crown className="size-5 text-terracotta-200" />}
          {hasActivity && <Ticket className="size-5 text-cosmic-200" />}
          {hasEvent && hasActivity && (
            <div className="flex items-center justify-center gap-1">
              <Crown className="size-4 text-terracotta-200" />
              <Ticket className="size-4 text-cosmic-200" />
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleTileClick = (date: Date) => {
    const dateString = date.toDateString();
    const event = futureHostedEvents.find(
      (event) => new Date(event.date).toDateString() === dateString
    );
    const activity = futureActivities.find(
      (activity) => new Date(activity.event.date).toDateString() === dateString
    );

    if (event) {
      router.push(`/dashboard/explore/${event.id}`);
    } else if (activity) {
      router.push(`/dashboard/explore/${activity.event.id}`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[300px]">
      <Calendar
        onChange={() => {}} // no need to handle changes
        value={new Date()} // default in current date
        tileContent={getTileContent}
        onClickDay={handleTileClick}
        className="w-full !border-none !bg-space-200"
        minDetail="month"
        maxDetail="month"
        defaultView="month"
        navigationLabel={({ date }) => (
          <span className="text-sm text-terracotta-800">
            {date.toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
        )}
      />
    </div>
  );
}
