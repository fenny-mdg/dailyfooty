import { cn } from "@/lib/utils.ts";

type FixtureCardTeamProps = {
  winner?: boolean;
  baseUrl?: string;
  score?: string;
  team: { img: string; name: string; abbreviation?: string };
};

const FixtureCardStatus = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("text-xs", className)} {...props} />
);

const FixtureCardTeams = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("w-full flex flex-col gap-2", className)} {...props} />
);

const FixtureCardTeam = ({
  team,
  score,
  winner = false,
}: FixtureCardTeamProps) => (
  <div
    className={cn("flex justify-between items-center", { "font-bold": winner })}
  >
    <div className="flex gap-4 items-center">
      <img src={`/media/${team.img}`} alt={team.abbreviation} className="w-6" />
      <p>{team.name}</p>
    </div>
    {score ? <p>{score}</p> : null}
  </div>
);
const FixtureCard = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex w-full border rounded px-8 py-4 items-center gap-4",
      className,
    )}
    {...props}
  />
);

export { FixtureCard, FixtureCardStatus, FixtureCardTeams, FixtureCardTeam };
