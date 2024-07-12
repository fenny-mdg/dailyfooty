import { cn } from "@/lib/utils.ts";
import { Team } from "~/utils/fixture-detail.ts";
import { Player } from "~/utils/player.ts";

import { Card, CardContent, CardFooter, CardHeader } from "./card.tsx";
import { FixtureCardTeam } from "./fixture-card.tsx";

type FormationSubsProps = {
  className?: string;
  formation: string;
  subs: Player[];
  coach: Player[];
  team: Team;
};

export const FormationSubs = ({
  formation,
  team,
  subs,
  coach,
  className,
}: FormationSubsProps) => {
  return (
    <Card className={cn("flex flex-col h-fit", className)}>
      <CardHeader className="flex justify-between flex-row items-center">
        <FixtureCardTeam team={team} /> <p className="!mt-0"> {formation}</p>
      </CardHeader>

      <CardContent className="flex-1">
        {subs.map((player) => (
          <span key={player.playerId} className="flex gap-2">
            <p>{player.number}</p>
            <p>{player.name}</p>
          </span>
        ))}
      </CardContent>

      <CardFooter className="flex justify-between lg:gap-4">
        <p className="font-medium">Headcoach </p>
        <p>{coach[0]?.name}</p>
      </CardFooter>
    </Card>
  );
};
