import { Gameroom, Player, User } from "../../types";
import { v4 as uuidv4 } from "uuid";

const winningMoves = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

class Store {
  sockets: Record<string, string> = {};
  queue: string[] = []; //* array of user ids
  rooms: Gameroom[] = [];

  addSocket(username: string, id: string) {
    this.sockets[username] = id;
    return this;
  }

  checkUser(username: string) {
    const isAlive = this.sockets[username];
    return !!isAlive;
  }
  removeSocketByUsername(username: string) {
    if (!this.sockets[username]) return;
    delete this.sockets[username];

    return this;
  }

  joinQ(id: string) {
    this.queue.push(id);
    return this;
  }

  matchMake(): Gameroom | undefined {
    if (this.queue.length < 2) return;

    const roomId = uuidv4();
    const player_1_id = this.queue.pop() as string;
    const player_2_id = this.queue.pop() as string;

    let player_1: Player, player_2: Player;
    const turn = randomIntFromInterval(1, 2);
    const letter = randomIntFromInterval(1, 2);

    Object.entries(this.sockets).forEach(([k, v]) => {
      if (player_1_id === v)
        player_1 = {
          id: v,
          username: k,
          letter: letter === 1 ? "x" : "o",
          turn: turn === 1,
        };
      if (player_2_id === v)
        player_2 = {
          id: v,
          username: k,
          letter: letter === 1 ? "o" : "x",
          turn: turn === 2,
        };
    });

    const gameroom = {
      id: roomId,
      // @ts-ignore
      player_1,
      // @ts-ignore
      player_2,
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
      gameState: "ongoing",
    };

    this.rooms.push(gameroom);

    return gameroom;
  }

  updateGame(roomId: string, updates: Gameroom) {
    this.rooms = this.rooms.map((room) => {
      if (room.id === roomId) return updates;

      return room;
    });
  }

  checkGameState(gameroom: Gameroom): "draw" | "ongoing" | "x" | "o" {
    const isBoardFilled = this.checkForDraw(gameroom);
    const winner = this.checkForWins(gameroom);

    if (isBoardFilled && !winner) return "draw";
    else if (!winner) return "ongoing";

    return winner;
  }

  checkForDraw(gameroom: Gameroom) {
    const board = Object.entries(gameroom.board);
    return board.every(([_, v]) => v !== "none");
  }

  checkForWins(gameroom: Gameroom) {
    let winner: "x" | "o" | null = null;
    const board = Object.entries(gameroom.board);
    const xPlays = board
      .map(([k, v]) => {
        if (v === "x") return k;
      })
      .filter(Boolean)
      .map((v) => Number(v));

    const oPlays = board
      .map(([k, v]) => {
        if (v === "o") return k;
      })
      .filter(Boolean)
      .map((v) => Number(v));

    winningMovesLabel: for (const winningMove of winningMoves) {
      let matchingMoves = 0;
      for (const boardIdx of xPlays) {
        if (!winningMove.includes(boardIdx)) {
          break;
        }
        matchingMoves++;
      }

      if (matchingMoves === 3) {
        winner = "x";
        break winningMovesLabel;
      }

      matchingMoves = 0;

      for (const boardIdx of oPlays) {
        if (!winningMove.includes(boardIdx)) {
          break;
        }
        matchingMoves++;
      }

      if (matchingMoves === 3) {
        winner = "o";
      }
    }

    return winner;
  }

  endGame(roomId: string) {
    this.rooms = this.rooms.filter((v) => v.id !== roomId);
    return this;
  }
}

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export { Store };
