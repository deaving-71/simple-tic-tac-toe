export type Message = {
  event: string;
  payload: any;
};

export type User = {
  id: string;
  username: string;
};

export type Player = User & {
  letter: "x" | "o";
  turn: boolean;
};

export type Gameroom = {
  id: string;
  player_1: Player;
  player_2: Player;
  board: Board;
  gameState: Gamestate;
};

export type Gamestate = "ongoing" | "x" | "o" | "draw";

export type Play = {
  roomId: string;
  user: User | null;
  play: number;
};

export type Board = Record<number, "x" | "o" | "none">;
