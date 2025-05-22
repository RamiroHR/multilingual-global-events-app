export type User = {
  id: string;
  email: string;
  username?: string;
};

export type AuthState = {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
};
