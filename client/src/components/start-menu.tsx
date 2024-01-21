import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSocket } from "@/store";
import { Message } from "@/type";

export function StartMenu() {
  const { socket, user } = useSocket();

  const startNewGame = () => {
    const message: Message = {
      event: "join-queue",
      payload: user,
    };

    socket?.send(JSON.stringify(message));
  };

  return (
    <div className="w-[21.875rem] text-center">
      <ul>
        <li>
          <Button variant="ghost" className="h-8">
            <Link to="/game" onClick={startNewGame}>
              Start a new game
            </Link>
          </Button>
        </li>
      </ul>
    </div>
  );
}
