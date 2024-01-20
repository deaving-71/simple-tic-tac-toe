import { User } from "@/type";
import { create } from "zustand";
import { Gameroom } from "../../../types";

type Socket = {
  user: User | null;
  socket: WebSocket | null;
  connected: boolean;
  isLoading: boolean;
  gameroom: Gameroom | null;
  login: (user: User) => void;
  logout: () => void;
  setIsLoading: (v: boolean) => void;
  setSocket: (socket: WebSocket) => void;
  setGameroom: (gameroom: Gameroom) => void;
};

const useSocket = create<Socket>((set) => ({
  user: null,
  socket: null,
  isLoading: false,
  connected: false,
  gameroom: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null, socket: null }),
  setIsLoading: (v) => set({ isLoading: v }),
  setSocket: (socket) => set({ socket }),
  setGameroom: (gameroom) => set({ gameroom }),
}));

export { useSocket };
