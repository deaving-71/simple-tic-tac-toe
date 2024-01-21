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

const me: User = {
  id: "zdg",
  username: "oy",
};

const placeholder: Gameroom = {
  id: "slf,a",
  player_1: {
    id: "zdg",
    username: "oy",
    letter: "o",
    turn: true,
  },
  player_2: {
    id: "safafaf",
    username: "ayaya",
    letter: "x",
    turn: false,
  },
  board: {
    0: "none",
    1: "none",
    2: "none",
    3: "none",
    4: "none",
    5: "none",
    6: "none",
    7: "none",
    8: "none",
  },
  gameState: "o",
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
