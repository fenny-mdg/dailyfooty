import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Shirt } from "lucide-react";
import invariant from "tiny-invariant";

import { Card, CardContent, CardTitle } from "@/components/ui/card.tsx";
import {
  FixtureEventList,
  FixtureEventScore,
  FixtureEventTeam,
} from "@/components/ui/fixture-detail.tsx";
import { FixtureList } from "@/components/ui/fixture-list.tsx";
import {
  FootballField,
  TeamFormation,
} from "@/components/ui/football-field.tsx";
import { FormationSubs } from "@/components/ui/formation-subs.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { cn } from "@/lib/utils.ts";
import { getFixtureCommentaries } from "~/utils/fixture-commentary.server.ts";
import { getFixtureDetail } from "~/utils/fixture-detail.server.ts";
import { getFixtureHeadToHead } from "~/utils/fixture-h2h.server.ts";
import { getFixtureLineups } from "~/utils/fixture-lineup.server.ts";
import { getFixtureStats } from "~/utils/fixture-stats.server.ts";
import {
  alwaysShowStatKeys,
  Statistics,
  statKeysMapper,
} from "~/utils/fixture-stats.ts";
import { getFixtureTable } from "~/utils/fixture-table.server.ts";
import { getFixture } from "~/utils/fixture.server.ts";
import { FixtureDTO } from "~/utils/fixture.ts";
import { Player } from "~/utils/player.ts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  invariant(typeof id === "string", "Fixture id must be string");

  const [
    fixture,
    fixtureDetail,
    stats,
    lineups,
    commentaries,
    table,
    headToHead,
  ] = await Promise.all([
    getFixture(id),
    getFixtureDetail(id),
    getFixtureStats(id),
    getFixtureLineups(id),
    getFixtureCommentaries(id),
    getFixtureTable(id),
    getFixtureHeadToHead(id),
  ]);

  return json({
    fixture,
    fixtureDetail,
    stats,
    lineups,
    commentaries: commentaries?.commentaries,
    table,
    headToHead,
  });
};

export default function FixtureDetail() {
  const {
    fixture,
    fixtureDetail,
    table,
    stats,
    commentaries,
    headToHead,
    lineups,
  } = useLoaderData<typeof loader>();
  const firstPeriod = fixtureDetail?.events?.firstPeriod;
  const hasEvent = Object.keys(firstPeriod || {}).length > 0;
  const secondPeriod = fixtureDetail?.events?.secondPeriod;
  const overtime = fixtureDetail?.events?.overtime;
  const allTable = table?.tables?.find((t) => t.kind === "all");
  const fixtureGroupedByCompetitions = headToHead?.h2h.reduce<
    Record<
      string,
      {
        order: number;
        competition: FixtureDTO["competition"];
        fixtures: FixtureDTO[];
      }
    >
  >((group, fixture, index) => {
    const { competition } = fixture;
    const { id: competitionId } = competition;

    if (!group[competitionId]) {
      group[competitionId] = { order: index, competition, fixtures: [] };
    }

    // @ts-expect-error Type issue
    group[competitionId].fixtures.push(fixture);

    return group;
  }, {});
  const competitionIds = Object.keys(fixtureGroupedByCompetitions || {});
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

  return (
    <div className="w-full">
      {fixture ? (
        <div>
          <Card>
            <CardTitle className="p-6 flex flex-col w-full">
              <h3 className="text-lg">{fixture.competition.name}</h3>
              <p className="text-sm font-normal">
                {fixture.competition.countryName}
              </p>
            </CardTitle>
            <CardContent className="flex flex-col">
              <div className="flex w-full justify-between mt-6">
                <FixtureEventTeam team={fixture.homeTeam} />
                <FixtureEventScore
                  // @ts-expect-error Date type issue
                  fixture={fixture}
                  fixtureDetail={fixtureDetail}
                />
                <FixtureEventTeam team={fixture.awayTeam} />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="event">
            <TabsList className="w-full flex overflow-auto justify-normal">
              {hasEvent ? (
                <TabsTrigger value="event" className="flex-1">
                  Event
                </TabsTrigger>
              ) : null}
              {lineups?.homeSubs ? (
                <TabsTrigger value="lineup" className="flex-1">
                  Lineup
                </TabsTrigger>
              ) : null}
              {stats ? (
                <TabsTrigger value="stats" className="flex-1">
                  Stats
                </TabsTrigger>
              ) : null}
              {table?.tables ? (
                <TabsTrigger value="table" className="flex-1">
                  Table
                </TabsTrigger>
              ) : null}
              {commentaries?.length ? (
                <TabsTrigger value="commentary" className="flex-1">
                  Commentary
                </TabsTrigger>
              ) : null}
              {headToHead?.h2h ? (
                <TabsTrigger value="h2h" className="flex-1">
                  H2H
                </TabsTrigger>
              ) : null}
            </TabsList>

            {hasEvent ? (
              <TabsContent title="Event" value="event">
                <FixtureEventList events={firstPeriod || {}} />
                <FixtureEventList events={secondPeriod || {}} />
                <FixtureEventList events={overtime || {}} />
              </TabsContent>
            ) : null}
            {lineups?.homeSubs ? (
              <TabsContent
                title="Lineup"
                value="lineup"
                className="flex flex-col lg:flex-row gap-4"
              >
                <FormationSubs
                  team={fixture.homeTeam}
                  className={cn("order-2 lg:order-1", {
                    "lg:flex-1": !displayLineupField,
                  })}
                  formation={lineups.homeFormation}
                  subs={
                    displayLineupField ? lineups.homeSubs : lineups.homeStarters
                  }
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
                        <span
                          key={index}
                          className="flex text-white items-start"
                        >
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
                        <span
                          key={index}
                          className="flex text-white items-start"
                        >
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
                  subs={
                    displayLineupField ? lineups.awaySubs : lineups.awayStarters
                  }
                  coach={lineups.awayCoach}
                />
              </TabsContent>
            ) : null}
            {stats ? (
              <TabsContent title="Stats" value="stats">
                <div className="w-full p-8 flex flex-col gap-4">
                  {Object.keys(stats).map((key) => {
                    // @ts-expect-error stats can't be null if we are here
                    const [home, away] = stats[key];
                    const max = home + away;
                    const homePercent = (home / max) * 100;
                    const awayPercent = (away / max) * 100;

                    return max || alwaysShowStatKeys.includes(key) ? (
                      <div key={key} className="flex flex-col w-full">
                        <div className="flex w-full">
                          <p>{home}</p>
                          <p className="flex-1 text-center">
                            {statKeysMapper[key as keyof Statistics].default}
                          </p>
                          <p>{away}</p>
                        </div>
                        <div className="flex gap-4">
                          <Progress
                            value={homePercent}
                            className="rotate-180 flex-1"
                          />
                          <Progress value={awayPercent} className="flex-1" />{" "}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </TabsContent>
            ) : null}
            {allTable ? (
              <TabsContent title="Table" value="table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>P</TableHead>
                      <TableHead>W</TableHead>
                      <TableHead>D</TableHead>
                      <TableHead>L</TableHead>
                      <TableHead>F</TableHead>
                      <TableHead>A</TableHead>
                      <TableHead>GD</TableHead>
                      <TableHead>PTS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allTable.teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell>{team.rank}</TableCell>
                        <TableCell>{team.name}</TableCell>
                        <TableCell>{team.played}</TableCell>
                        <TableCell>{team.wins}</TableCell>
                        <TableCell>{team.draws}</TableCell>
                        <TableCell>{team.losses}</TableCell>
                        <TableCell>{team.goalsFor}</TableCell>
                        <TableCell>{team.goalsAgainst}</TableCell>
                        <TableCell>{team.goalsDiff}</TableCell>
                        <TableCell>{team.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            ) : null}
            {commentaries?.length ? (
              <TabsContent title="Commentary" value="commentary">
                <div className="w-full flex flex-col">
                  {commentaries.map(({ time, text }) => (
                    <>
                      <div
                        key={text}
                        className="px-4 py-2 flex gap-4 text-xs md:text-base"
                      >
                        <p className="w-14 text-center shrink-0">{time}</p>{" "}
                        <p>{text}</p>
                      </div>
                      <Separator />
                    </>
                  ))}
                </div>
              </TabsContent>
            ) : null}
            {fixtureGroupedByCompetitions ? (
              <TabsContent
                title="H2H"
                value="h2h"
                className="flex flex-col gap-8 p-4 lg:p-8"
              >
                {competitionIds.map((competitionId: string) => {
                  const { competition, fixtures: currentFixtures } =
                    fixtureGroupedByCompetitions[competitionId];

                  return (
                    <div key={competitionId}>
                      <div>
                        <div className="mb-4">
                          <h4 className="font-medium">{competition.name}</h4>
                          <p className="text-xs">{competition.countryName}</p>
                        </div>
                        <FixtureList fixtures={currentFixtures} disableLinks />
                      </div>
                    </div>
                  );
                })}
              </TabsContent>
            ) : null}
          </Tabs>
        </div>
      ) : (
        <div>
          <h3>Fixture not found</h3>
        </div>
      )}
    </div>
  );
}
