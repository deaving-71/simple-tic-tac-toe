import WebSocket, { WebSocketServer } from "ws";
import { Store } from "./store";
import { v4 as uuidv4 } from "uuid";
import { Message, Play, User } from "../../types";

const wss = new WebSocketServer({ port: 5000 });
const store = new Store();
let matchMakingInterval: string | number | NodeJS.Timeout;
let isIntervalUp = false;

wss.on("connection", (ws) => {
  function emit(eventname: string, payload: Object) {
    ws.send(JSON.stringify({ event: eventname, payload }));
  }

  function broadcast(eventname: string, payload: Object) {
    wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ event: eventname, payload }));
      }
    });
  }

  function to(receiver: string, eventname: string, payload: Object) {
    wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN && ws.id === receiver) {
        ws.send(JSON.stringify({ event: eventname, payload }));
      }
    });
  }

  function toRoom(roomId: string, eventname: string, payload: Object) {
    const room = store.rooms.find((v) => v.id === roomId);

    if (!room) return;

    wss.clients.forEach((ws) => {
      if (
        ws.readyState === WebSocket.OPEN &&
        (ws.id === room.player_1.id || ws.id === room.player_2.id)
      ) {
        ws.send(JSON.stringify({ event: eventname, payload }));
      }
    });
  }

  if (!isIntervalUp) {
    matchMakingInterval = setInterval(() => {
      const gameroom = store.matchMake();
      if (!gameroom) return;

      to(gameroom.player_1.id, "join-gameroom", gameroom);
      to(gameroom.player_2.id, "join-gameroom", gameroom);

      console.log("rooms: ", store.rooms);
    }, 3000);
  }
  isIntervalUp = true;

  ws.on("message", (incomingMessage) => {
    //TODO: check how to type cast incomingmessage
    // @ts-ignore
    const data = JSON.parse(incomingMessage) as Message;

    if (!("event" in data)) {
      throw new Error("Key 'event' missing in the incoming message.");
    }

    if (!("payload" in data)) {
      throw new Error("Key 'payload' missing in the incoming message.");
    }

    const { event, payload } = data;
    switch (event) {
      case "connect":
        {
          const { username } = payload as { username: string };
          const id = uuidv4();
          console.log(`${username} conencted, with id: ${id}`);
          emit("connect", { id, username });
          ws.id = id;
          store.addSocket(username, id);
        }

        break;

      case "join-queue": {
        const { username, id } = payload as User;
        const isAlive = store.checkUser(username);
        //! disonnect user;
        if (!isAlive) break;

        store.joinQ(id);
      }

      case "player-move":
        {
          const { play, roomId, user } = payload as Play;
          const gameroom = store.rooms.find((v) => v.id === roomId);
          if (!gameroom) {
            console.error("Gameroom no longer exists.");
            break;
          }

          const player =
            gameroom.player_1.id === user.id
              ? gameroom.player_1
              : gameroom.player_2;

          if (!player.turn) {
            console.error(
              `${player.username} tried to make a move when it was not their turn.`
            );
            break;
          }
          const updatedGame = {
            ...gameroom,
            player_1: {
              ...gameroom.player_1,
              turn: !gameroom.player_1.turn,
            },
            player_2: {
              ...gameroom.player_2,
              turn: !gameroom.player_2.turn,
            },
            board: {
              ...gameroom.board,
              [play]: player.letter,
            },
          };

          const updatedGameState = {
            ...updatedGame,
            gameState: store.checkGameState(updatedGame),
          };
          if (updatedGameState.gameState === "ongoing") {
            toRoom(roomId, "player-move", updatedGameState);
            store.updateGame(roomId, updatedGameState);
          } else {
            console.log(
              `game: ${updatedGameState.id} ended with ${updatedGameState.gameState}`
            );
            toRoom(roomId, "player-move", updatedGameState);
            store.endGame(roomId);
          }
        }
        break;

      default:
        break;
    }

    console.log("##########################################");
    console.log(data);
    console.log("sockets connected:", store.sockets);
    console.log("queue: ", store.queue);

    console.log("##########################################");
  });

  ws.on("close", () => {
    console.log(`user disconnected.`);
  });
});

wss.on("close", function close() {
  clearInterval(matchMakingInterval);
});

wss.on("error", (error) => {
  console.error(`WebSocket server error: ${error}`);
});
