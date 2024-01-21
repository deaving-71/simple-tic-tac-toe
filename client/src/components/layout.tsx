import { useSocket } from "@/store";
import { Message, User } from "@/type";
import { Gameroom } from "../../../types";
import { useEffect } from "react";

export type LayoutProps = React.PropsWithChildren;

export function Layout({ children }: LayoutProps) {
  const { socket, login, setIsLoading, setGameroom } = useSocket();

  useEffect(() => {
    socket?.addEventListener("message", (incomingMessage) => {
      //TODO: check how to type cast incomingmessage
      // @ts-ignore
      const data = JSON.parse(incomingMessage.data) as Message;

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
            const user = payload as User;
            login(user);
            setIsLoading(false);
          }
          break;

        case "join-gameroom":
          {
            const gameroom = payload as Gameroom;
            setGameroom(gameroom);
          }
          break;

        case "player-move":
          {
            const updatedGameroom = payload as Gameroom;
            console.log("updatedGameroom: ", updatedGameroom);

            setGameroom(updatedGameroom);
          }
          break;

        default:
          break;
      }
    });
  }, [socket?.OPEN]);

  return <>{children}</>;
}
