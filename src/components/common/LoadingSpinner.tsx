import { memo } from "react";
import { LoadingSpinnerProps } from "@/lib/types/components";

export const LoadingSpinner = memo(({ size = "md" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "size-4",
    md: "size-8",
    lg: "size-12",
  };

  return (
    <div className="flex justify-center py-8">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-cosmic-500`}
      />
    </div>
  );
});

LoadingSpinner.displayName = "LoadingSpinner";
