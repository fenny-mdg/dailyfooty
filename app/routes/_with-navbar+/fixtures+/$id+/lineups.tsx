import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Shirt } from "lucide-react";
import invariant from "tiny-invariant";

import {
  FootballField,
  TeamFormation,
} from "@/components/ui/football-field.tsx";
import { FormationSubs } from "@/components/ui/formation-subs.tsx";
import { cn } from "@/lib/utils.ts";
import { getFixtureLineups } from "~/utils/fixture-lineup.server.ts";
import { getFixture } from "~/utils/fixture.server.ts";
import { Player } from "~/utils/player.ts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  invariant(typeof id === "string", "Fixture id must be string");

  const [lineups, fixture] = await Promise.all([
    getFixtureLineups(id),
    getFixture(id),
  ]);

  return json({
    lineups,
    fixture,
  });
};

export default function Lineups() {
  const { lineups, fixture } = useLoaderData<typeof loader>();
  const awayStarterGroupedByPosition = lineups?.awayStarters?.reduce<
    Record<string, Player[]>
  >((group, player) => {
    const { fieldPosition } = player;
    const [role] = fieldPosition ? fieldPosition.split(":") : ["all"];

    if (!group[role]) {
      group[role] = [];
    }

    group[role].push(player);

    return group;
  }, {});
  const awayLineup = Object.values(awayStarterGroupedByPosition || {})
    .map((lineup) => lineup.reverse())
    .reverse();

  const homeStarterGroupedByPosition = lineups?.homeStarters?.reduce<
    Record<string, Player[]>
  >((group, player) => {
    const { fieldPosition } = player;
    const [role] = fieldPosition ? fieldPosition.split(":") : ["all"];

    if (!group[role]) {
      group[role] = [];
    }

    group[role].push(player);

    return group;
  }, {});
  const homeLineup = Object.values(homeStarterGroupedByPosition || {});
  const positionKeys = Object.keys(homeStarterGroupedByPosition || {});
  const displayLineupField =
    Object.keys(positionKeys).length && !positionKeys.includes("all");

  return lineups?.homeSubs && fixture ? (
    <div className="flex flex-col lg:flex-row gap-4">
      <FormationSubs
        team={fixture.homeTeam}
        className={cn("order-2 lg:order-1", {
          "lg:flex-1": !displayLineupField,
        })}
        formation={lineups.homeFormation}
        subs={displayLineupField ? lineups.homeSubs : lineups.homeStarters}
        coach={lineups.homeCoach}
      />
      {displayLineupField ? (
        <FootballField
          className={cn(
            "lg:flex-1 order-1 lg:order-2",
            "flex flex-col lg:items-end lg:text-right",
          )}
        >
          <TeamFormation>
            {homeLineup.map((lineup, index) => (
              <span key={index} className="flex text-white items-start">
                {lineup.map((player) => (
                  <div
                    key={player.playerId}
                    className="flex-1 flex flex-col items-center text-xs font-medium"
                  >
                    <span className="rounded-full flex items-center justify-center w-7 h-7 md:w-8 md:h-8">
                      <Shirt
                        className="w-8 h-8 md:w-9 md:h-9"
                        width="inherit"
                        height="inherit"
                        strokeWidth={1}
                        stroke="white"
                        fill="white"
                      />
                      <p className="absolute text-[9px] font-bold md:text-xs lg:text-[9px] text-black">
                        {player.number}
                      </p>
                    </span>

                    <p>{player.shortName}</p>
                  </div>
                ))}
              </span>
            ))}
          </TeamFormation>
          <TeamFormation className="top-[50%]">
            {awayLineup.map((lineup, index) => (
              <span key={index} className="flex text-white items-start">
                {lineup.map((player) => (
                  <div
                    key={player.playerId}
                    className="flex-1 flex flex-col items-center text-xs font-medium"
                  >
                    <span className="rounded-full flex items-center justify-center w-7 h-7 md:w-8 md:h-8">
                      <Shirt
                        className="w-8 h-8 md:w-9 md:h-9"
                        width="inherit"
                        height="inherit"
                        strokeWidth={1}
                        stroke="black"
                        fill="black"
                      />
                      <p className="absolute text-[9px] font-bold md:text-xs lg:text-[9px]">
                        {player.number}
                      </p>
                    </span>

                    <p>{player.shortName}</p>
                  </div>
                ))}
              </span>
            ))}
          </TeamFormation>
        </FootballField>
      ) : null}
      <FormationSubs
        team={fixture.awayTeam}
        className={cn("order-3", {
          "lg:flex-1": !displayLineupField,
        })}
        formation={lineups.awayFormation}
        subs={displayLineupField ? lineups.awaySubs : lineups.awayStarters}
        coach={lineups.awayCoach}
      />
    </div>
  ) : null;
}
