import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ConfirmationModalProps } from "@/lib/types/components";

export const ConfirmationModal = ({
  title,
  eventTitle,
  isLoading,
  error,
  children,
  primaryAction,
  secondaryAction,
}: ConfirmationModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="max-h-[90vh] w-[600px] max-w-4xl overflow-y-auto rounded-lg bg-space-200 shadow-xl">
        <div className="w-full max-w-2xl p-8">
          {/* Modal Title Section */}
          <h2
            className="mb-4 text-center text-2xl font-bold text-terracotta-400"
            id="confirmation-modal-title"
          >
            {title}
          </h2>

          {/* Event title & detail section */}
          <div className="mb-4 flex h-8 items-center justify-center">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <h3 className="text-center text-xl font-bold text-white">&quot;{eventTitle}&quot;</h3>
            )}
          </div>

          {/* Children Section - content section */}
          <div>{children}</div>

          {/* Error display section */}
          {error && (
            <div className="rounde-md mt-4 bg-terracotta-100 text-center text-terracotta-800">
              {error}
            </div>
          )}

          {/* Action buttons section */}
          <div className="mt-8 flex justify-center gap-4">
            {/* Confirmation action */}
            {primaryAction && (
              <button
                className="rounded-md border border-terracotta-500/30 px-4 py-2 text-sm font-medium
                      text-terracotta-200 transition-colors hover:bg-space-400/40"
                onClick={primaryAction.onClick}
                disabled={primaryAction.isLoading}
              >
                {primaryAction.isLoading ? "Processing..." : primaryAction.label}
              </button>
            )}

            {/* Default action */}
            <button
              className="rounded-md bg-terracotta-500 px-6 py-2 text-sm font-medium text-space-100
                  transition-colors hover:bg-terracotta-400 focus:outline-none focus:ring-2
                  focus:ring-terracotta-400 focus:ring-offset-1 disabled:opacity-50"
              onClick={secondaryAction.onClick}
              disabled={primaryAction?.isLoading}
            >
              {secondaryAction.label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
