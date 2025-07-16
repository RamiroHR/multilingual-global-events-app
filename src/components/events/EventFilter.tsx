import { memo } from "react";
import { EventFilterProps } from "@/lib/types/components";

export const EventFilter = memo(
  ({
    showOnlineOnly,
    onFilterChange,
    selectedCountry,
    onCountryChange,
    availableCountries,
  }: EventFilterProps) => {
    return (
      <div className="rounded bg-gradient-to-r from-space-300 to-terracotta-900 shadow-sm">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-end space-x-4">
            {/* Country Filter */}
            <div className="rounded-md border border-terracotta-500/30 bg-lunar-900/50 px-4 py-2">
              <select
                id="country-filter"
                value={selectedCountry || ""}
                onChange={(e) => onCountryChange(e.target.value || null)}
                className="cursor-pointer bg-transparent text-space-200 transition-colors duration-200
                hover:text-space-100 focus:outline-none"
              >
                <option value="">All Countries</option>
                {availableCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Online Filter */}
            <div className="rounded-md border border-terracotta-500/30 bg-lunar-900/50 px-4 py-2">
              <label className="group flex cursor-pointer items-center space-x-2 text-space-200">
                <input
                  type="checkbox"
                  checked={showOnlineOnly}
                  onChange={(e) => onFilterChange(e.target.checked)}
                  className="size-4 rounded  border-terracotta-500/30 text-terracotta-400 transition-colors
                  duration-200 hover:border-cosmic-400 focus:ring-2 focus:ring-cosmic-500
                  focus:ring-offset-2 focus:ring-offset-lunar-800"
                />
                <span className="transition-colors duration-200 group-hover:text-space-100">
                  Online only
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

EventFilter.displayName = "EventFilter";
