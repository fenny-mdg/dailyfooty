import * as React from "react";

import { cn } from "@/lib/utils.ts";

const commonClassNames = {
  corner: "border-[#96a772] border-2 rounded-full h-10 w-10 absolute",
};

type PenaltyBoxProps = {
  position: "top" | "bottom";
};

const penaltyBoxClassNames = {
  top: {
    box: "-top-[2px] left-[25%]",
    external: "left-[calc(50%-29px)] top-[66px] rotate-180",
  },
  bottom: {
    box: "-bottom-[2px] left-[25%]",
    external: "left-[calc(50%-29px)] bottom-[66px] ",
  },
};

const PenaltyBox = ({ position }: PenaltyBoxProps) => {
  const { box, external } = penaltyBoxClassNames[position];
  return (
    <>
      <div
        className={cn(
          "w-1/2 h-[10%] z-[19] absolute border-2 border-[#96a772]",
          box,
        )}
      >
        <div
          className={cn(
            "w-1/2  z-[19] h-6 absolute border-2 border-[#96a772]",
            box,
          )}
        ></div>
      </div>
      <div
        className={cn(
          "absolute border-2 border-[#96a772] w-[58px] h-[15px] rounded-br-none rounded-bl-none rounded-tl-[50%_100%] rounded-tr-[50%_100%]",
          external,
        )}
      ></div>
    </>
  );
};

export const TeamFormation = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col h-1/2 justify-between p-2 absolute w-full z-20",
      className,
    )}
    {...props}
  />
));

TeamFormation.displayName = "TeamFormation";

export const FootballField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "h-[708px] overflow-hidden relative border-2 border-[#96a772] bg-football-field",
        className,
      )}
    >
      <PenaltyBox position="top" />

      <>
        {/* Center line */}
        <div className="border-[#96a772] absolute top-[calc(50%-2px)] w-full border"></div>

        {/* Center dot */}
        <div className="absolute rounded-full bg-[#96a772] h-[6px] w-[6px] left-[calc(50%-3px)] top-[calc(50%-4px)]"></div>

        {/* Center circle */}
        <div className="absolute rounded-full h-[76px] w-[76px] border-2 border-[#96a772] left-[calc(50%-38px)] top-[calc(50%-38px)]"></div>
      </>

      {/* Corners */}
      <div className="h-full w-full relative overflow-hidden">
        <div className={cn("-left-5 -top-5 ", commonClassNames.corner)}></div>
        <div
          className={cn(
            "left-[calc(100%-20px)] -top-5 ",
            commonClassNames.corner,
          )}
        ></div>
        <div
          className={cn("-bottom-5 -right-5 ", commonClassNames.corner)}
        ></div>
        <div
          className={cn("-left-5 -bottom-5 ", commonClassNames.corner)}
        ></div>
      </div>

      <PenaltyBox position="bottom" />

      {props.children}
    </div>
  );
});

FootballField.displayName = "FootballField";
