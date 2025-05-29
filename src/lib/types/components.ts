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
