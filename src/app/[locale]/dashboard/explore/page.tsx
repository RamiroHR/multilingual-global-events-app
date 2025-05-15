"use client";

import { useState } from "react";
import { EventList } from "@/components/events/EventList";
import { getAllMockEvents, getMockEventsByType } from "@/mocks/events";

export default function ExplorationPage() {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const allEvents = getAllMockEvents();
  const displayedEvents = showOnlineOnly
    ? getMockEventsByType(true)
    : allEvents;

  return (
    <div className="min-h-screen rounded bg-space-300">
      {/* Title Section */}
      <div className=" bg-space-300">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-terracotta-800">
            Explore Events
          </h1>
          <p className="mt-2 text-lunar-200">
            Discover and join exciting events from around the world
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="rounded bg-gradient-to-r from-space-300 to-terracotta-900 shadow-sm">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-end space-x-4">
            <label className="flex items-center space-x-2 text-space-200">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="rounded border-lunar-300 text-cosmic-500 focus:ring-cosmic-500"
              />
              <span>Show online events only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Events List */}
      <EventList events={displayedEvents} />
    </div>
  );
}
