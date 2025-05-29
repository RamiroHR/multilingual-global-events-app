import { Id } from "./database";
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
  onViewDetails?: (eventId: number) => void;
}

export interface ErrorDisplayProps {
  error: string;
}

export interface EventFilterProps {
  showOnlineOnly: boolean;
  onFilterChange: (showOnlineOnly: boolean) => void;
}

// Loading and Error states
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

// Event Detail components
export interface EventDetailsHeaderProps {
  title: string;
  creator: Id;
}

export interface EventDetailsInfoProps {
  date: Date;
  isOnline: boolean;
  location?: string;
  participantsCount: number;
  maxCapacity: number;
}

export interface EventDetailsActionsProps {
  hasApplied: boolean;
  isFull: boolean;
  spotsLeft: number;
  onJoinEvent: () => Promise<void>;
  error?: string;
}
