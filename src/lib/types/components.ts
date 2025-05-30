import { Id, ParticipationStatus } from "./database";
import { EventWithRelations, CreateEventInput } from "./utils_events";
import { Application } from "./utils_applications";
import { ReactNode } from "react";
import { ObjectSchema } from "yup";
import { FormikHelpers } from "formik";

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

// Type for the application in the joining page
export type ApplicationStatus = ParticipationStatus;

export interface ApplicationCardProps {
  applicationId: number;
  event: EventWithRelations;
  applicationStatus: ApplicationStatus;
}

export interface ApplicationListProps {
  applications: Application[];
  onApplicationUpdate?: () => Promise<void>;
}

// Loading and Error states
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

// type for ConfirmationModal component
export interface ConfirmationModalProps {
  title: string;
  eventTitle: string;
  isLoading: boolean;
  error?: string | null;
  children: ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    isLoading?: boolean;
  };
  secondaryAction: {
    label: string;
    onClick: () => void;
  };
}

// type for EventOwnerCard
export interface EventOwnerCardProps {
  event: EventWithRelations;
  onEdit: (eventId: number) => void;
  onCancel: (eventId: number) => void;
  onManageSubscriptions: (eventId: number) => void;
}

// types for the edit event form
export interface EditEventFormProps {
  event: EventWithRelations;
  onSuccess: () => void;
  onCancel: () => void;
}

// types ofr the EventFormBase
export type EventFormValues = Omit<CreateEventInput, "creatorId" | "date" | "endDate"> & {
  date: string;
  endDate: string;
  location: string;
  webinar?: string;
};

export interface EventFormBaseProps {
  initialValues: EventFormValues;
  validationSchema: ObjectSchema<EventFormValues>;
  onSubmit: (values: EventFormValues, helpers: FormikHelpers<EventFormValues>) => Promise<void>;
  submitButtonText: string;
  title: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}
