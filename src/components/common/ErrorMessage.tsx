import { memo } from "react";
import { ErrorDisplayProps } from "@/lib/types/components";

export const ErrorMessage = memo(({ error }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className="mt-4 rounded-md bg-red-500/10 p-4 text-center text-sm text-red-400">
      {error}
    </div>
  );
});

ErrorMessage.displayName = "ErrorMessage";
