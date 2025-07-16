import { EventOwnerCard } from "@/components/events/EventOwnerCard";
import { useRouter } from "next/navigation";
import { EventWithRelations } from "@/lib/types";

interface NextEventCardProps {
  event: EventWithRelations;
}

export const NextEventCard = ({ event }: NextEventCardProps) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/my-events/${event.id}/edit`);
  };

  const handleCancel = () => {
    router.push(`/dashboard/my-events/${event.id}/cancel`);
  };

  const handleManageSubscriptions = () => {
    router.push(`/dashboard/my-events/${event.id}/subscriptions`);
  };

  return (
    <EventOwnerCard
      event={event}
      onEdit={handleEdit}
      onCancel={handleCancel}
      onManageSubscriptions={handleManageSubscriptions}
    />
  );
};
