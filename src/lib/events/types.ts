export interface CreateEventInput {
  title: string;
  description: string;
  date: Date;
  location: string;
  isOnline?: boolean;
  maxCapacity: number;
  creatorId: number;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  date?: Date;
  location?: string;
  maxCapacity?: number;
  isCancelled?: boolean;
}
