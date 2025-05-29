import { memo } from "react";
import { EventFilterProps } from "@/lib/types/components";

export const EventFilter = memo(({ showOnlineOnly, onFilterChange }: EventFilterProps) => {
  return (
    <div className="rounded bg-gradient-to-r from-space-300 to-terracotta-900 shadow-sm">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-end space-x-4">
          <label className="flex items-center space-x-2 text-space-200">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => onFilterChange(e.target.checked)}
              className="rounded border-lunar-300 text-cosmic-500 focus:ring-cosmic-500"
            />
            <span>Show online events only</span>
          </label>
        </div>
      </div>
    </div>
  );
});

EventFilter.displayName = "EventFilter";
