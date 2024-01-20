import { Gameroom, Player, User } from "../../types";
import { v4 as uuidv4 } from "uuid";

class Store {
  sockets: Record<string, string> = {};
  queue: string[] = []; //* array of usernames
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
    };

    this.rooms.push(gameroom);

    return gameroom;
  }

  updateGame(roomId: string, updates: Gameroom) {
    // TODO: check for either side won
    this.rooms = this.rooms.map((room) => {
      if (room.id === roomId) return updates;

      return room;
    });
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
