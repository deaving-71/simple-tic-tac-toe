import { cn } from "@/lib/utils";

export type GameOutcomeProps = {
  outcome: "victory" | "defeat" | "draw" | "ongoing";
};

function GameOutcome({ outcome }: GameOutcomeProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 grid place-content-center bg-transparent",
        outcome === "ongoing" && "hidden"
      )}>
      <div>
        <div
          className={cn(
            "text-[6rem] sm:text-[8rem] font-bold  bg-background border-y py-8 w-dvw  text-center uppercase",
            outcome === "victory" &&
              "text-yellow-100 [text-shadow:_0_0_30px_rgb(234_179_8_/_100%)]",
            outcome === "defeat" &&
              "text-red-100 [text-shadow:_0_0_30px_rgb(239_68_68_/_100%)]",
            outcome === "draw" &&
              "text-blue-100 [text-shadow:_0_0_30px_rgb(59_130_246_/_100%)]"
          )}>
          {outcome}
        </div>
      </div>
    </div>
  );
}

export { GameOutcome };
