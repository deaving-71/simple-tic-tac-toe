import { useSocket } from "@/store";
import { GameOutcome, Loading } from ".";
import { Message, Play } from "../../../types";
import { cn } from "@/lib/utils";

export function Game() {
  const { gameroom, user, socket } = useSocket();

  if (!gameroom) return <Loading />;

  const me =
    gameroom?.player_1.id === user?.id
      ? gameroom?.player_1
      : gameroom?.player_2;

  const opponent =
    gameroom?.player_1.id === user?.id
      ? gameroom?.player_2
      : gameroom?.player_1;

  const outcome =
    gameroom.gameState === "draw" || gameroom.gameState === "ongoing"
      ? gameroom.gameState
      : gameroom.gameState === me.letter
        ? "victory"
        : "defeat";

  const playermove = (idx: number) => {
    const p: Play = {
      roomId: gameroom.id,
      play: idx,
      user,
    };
    const message: Message = {
      event: "player-move",
      payload: p,
    };
    socket?.send(JSON.stringify(message));
  };

  return (
    <>
      <div className="w-fit mx-auto">
        <div className="flex items-center justify-between w-full text-lg">
          <div
            className={cn(
              me?.turn ? "text-foreground" : "text-muted-foreground"
            )}>
            {me?.username}
          </div>
          <div
            className={cn(
              opponent?.turn ? "text-foreground" : "text-muted-foreground"
            )}>
            {opponent?.username}
          </div>
        </div>
        <div className="mx-auto w-fit p-8 grid grid-cols-3 grid-rows-3">
          {Object.entries(gameroom.board).map(([k, v], idx) => (
            <button
              key={k + idx}
              type="button"
              className={cn(
                "size-40 grid place-content-center disabled:cursor-not-allowed",
                idx !== 2 && idx !== 5 && idx !== 8 && "border-r",
                idx !== 6 && idx !== 7 && idx !== 8 && "border-b",
                me?.turn &&
                  gameroom.board[idx] === "none" &&
                  gameroom.gameState === "ongoing" &&
                  "hover:bg-muted/30"
              )}
              onClick={() => playermove(idx)}
              disabled={
                !me?.turn ||
                gameroom.board[idx] !== "none" ||
                gameroom.gameState !== "ongoing"
              }>
              <Letter letter={v} />
            </button>
          ))}
        </div>
      </div>
      <GameOutcome outcome={gameroom ? outcome : "ongoing"} />
    </>
  );
}

export type PlayProps = {
  letter?: "x" | "o" | "none";
};

function Letter({ letter }: PlayProps) {
  if (letter === "x") {
    return (
      <div>
        <span className="w-28 h-[1px] bg-border block rotate-45"></span>
        <span className="w-28 h-[1px] bg-border block -rotate-45"></span>
      </div>
    );
  } else if (letter === "o") {
    return <div className="size-28 rounded-full bg-transparent border"></div>;
  }

  return null;
}
