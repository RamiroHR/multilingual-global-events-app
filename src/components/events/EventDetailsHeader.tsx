import { memo } from "react";
import { EventDetailsHeaderProps } from "@/lib/types/components";

export const EventDetailsHeader = memo(({ title, creator }: EventDetailsHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-space-100">{title}</h1>
      <p className="mt-2 text-lunar-500">by {creator}</p>
    </div>
  );
});

EventDetailsHeader.displayName = "EventDetailsHeader";
