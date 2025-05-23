import { QuickStatsCard } from "@/components/dashboard/QuickStatsCard";

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="rounded-lg bg-gradient-to-r from-space-300 to-terracotta-900 p-6">
        <h1 className="text-2xl font-bold text-white">Welcome back, Ramiro!</h1>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <QuickStatsCard title="Events Created" value="12" />
          <QuickStatsCard title="Upcoming Events" value="5" />
          <QuickStatsCard title="Total Participants" value="150" />
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Upcoming Events */}
        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-lg bg-space-200 p-6">
            <h2 className="mb-4 text-xl font-semibold text-terracotta-800">
              Upcoming event section
            </h2>
            <p className="text-lunar-300">Your upcoming events will appear here.</p>
          </div>
          <div className="rounded-lg bg-space-200 p-6">
            <h2 className="mb-4 text-xl font-semibold text-terracotta-800">Activity Feed</h2>
            <p className="text-lunar-300">Your recent activities will appear here.</p>
          </div>
        </section>

        {/* Right Column - Sidebar */}
        <section className="space-y-6">
          <div className="rounded-lg bg-space-200 p-6">
            <h2 className="mb-4 text-xl font-semibold text-terracotta-800">Calendar Preview</h2>
            <p className="text-lunar-300">Your upcoming events calendar will appear here.</p>
          </div>

          <div className="rounded-lg bg-space-200 p-6">
            <h2 className="mb-4 text-xl font-semibold text-terracotta-800">Quick Stats</h2>
            <p className="text-lunar-300">Your event statistics will be displayed here.</p>
          </div>

          <div className="rounded-lg bg-space-200 p-6">
            <h2 className="mb-4 text-xl font-semibold text-terracotta-800">Recent Activity</h2>
            <p className="text-lunar-300">Your recent activities and updates will appear here.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
