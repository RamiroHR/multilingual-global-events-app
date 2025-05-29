import { EventWithRelations } from "./utils_events";

// Common component props
export interface BaseCardProps {
  className?: string;
}

// Auth components
export type AuthFormType = "login" | "signup";

export interface AuthFormData {
  email: string;
  password: string;
  username?: string;
}

export interface AuthFormProps {
  type: AuthFormType;
  onSubmit: (data: AuthFormData) => Promise<void>;
}

// types for the Sidebar
export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Event components
export interface EventListProps {
  events: EventWithRelations[];
}

export interface EventCardProps {
  event: EventWithRelations;
  // className?: string;
  onViewDetails?: (eventId: number) => void;
}

export interface ErrorDisplayProps {
  error: string;
  // className?: string;
}

export interface EventFilterProps {
  showOnlineOnly: boolean;
  onFilterChange: (showOnlineOnly: boolean) => void;
}

// Loading and Error states
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}
