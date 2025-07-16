import { EventParticipant } from "@prisma/client";

type EventApplication = EventParticipant & {
  user: {
    id: number;
    username: string;
    email: string;
  };
  event: {
    id: number;
    title: string;
    maxCapacity: number;
  };
};

interface UserApplicationProps {
  application: EventApplication;
  onAccept: (applicationId: number) => void;
  onReject: (applicationId: number) => void;
}

export const UserApplication = ({ application, onAccept, onReject }: UserApplicationProps) => {
  return (
    <div className="flex items-center p-4">
      {/* User information */}
      <div className="w-[200px] text-right">
        <div>
          <p className="font-medium text-white">{application.user.username}</p>
          <p className="text-sm text-lunar-100">{application.user.email}</p>
        </div>
      </div>

      {/* application Status information */}
      <div className="flex w-[120px] justify-center">
        <span
          className={`rounded px-2 py-1 text-sm ${
            application.status === "PENDING"
              ? "bg-yellow-500/20 text-yellow-500"
              : application.status === "ACCEPTED"
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
          }`}
        >
          {application.status}
        </span>
      </div>

      {/* Review action buttons */}
      <div className="w-[200px] text-right">
        {application.status == "PENDING" && (
          <div className="flex items-center gap-1">
            <span className="mr-1 whitespace-nowrap p-1 text-sm"> ⟶ &nbsp; Allow ? </span>
            <button
              className="mr-1 rounded bg-cosmic-500/50 px-2 py-1"
              onClick={() => onAccept(application.id)}
            >
              Yes
            </button>
            <button
              className="rounded bg-cosmic-500/50 px-2 py-1"
              onClick={() => onReject(application.id)}
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
