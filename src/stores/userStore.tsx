// src/store.ts
import { create } from 'zustand';

interface UserState {
  userId: string | null;
  email: string | null;
  name: string | null;
  picture: string | null;
  role: string | null;
  setUser: (user: {
    userId: string;
    email: string;
    name: string;
    picture: string;
    role: string;
  }) => void;
  clearUser: () => void;
}

// Create Store
export const useUserStore = create<UserState>((set) => ({
  // 1. Define initial state (State)
  userId: null,
  email: null,
  name: null,
  picture: null,
  role: null,

  // 2. Define actions (Actions)
  setUser: (user) =>
    set(() => ({
      userId: user.userId,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role,
    })),

  clearUser: () =>
    set(() => ({
      userId: null,
      email: null,
      name: null,
      picture: null,
      role: null,
    })),
}));
