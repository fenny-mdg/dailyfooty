import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import {
  CalendarClock,
  Coins,
  MessageCircleMore,
  Shirt,
  BarChart,
  Table,
} from "lucide-react";
import invariant from "tiny-invariant";

import { Card, CardContent, CardTitle } from "@/components/ui/card.tsx";
import {
  FixtureEventScore,
  FixtureEventTeam,
} from "@/components/ui/fixture-detail.tsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { hasFixtureCommentaries } from "~/utils/fixture-commentary.server.ts";
// import { getFixtureDetail } from "~/utils/fixture-detail.server.ts";
import { hasFixtureHeadToHead } from "~/utils/fixture-h2h.server.ts";
import { hasFixtureLineup } from "~/utils/fixture-lineup.server.ts";
import { hasFixtureStats } from "~/utils/fixture-stats.server.ts";
import { hasFixtureTable } from "~/utils/fixture-table.server.ts";
import { getFixture } from "~/utils/fixture.server.ts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  invariant(typeof id === "string", "Fixture id must be string");

  const [
    fixture,
    // fixtureDetail,
    hasStats,
    hasLineups,
    hasH2H,
    hasTable,
    hasCommentaries,
  ] = await Promise.all([
    getFixture(id),
    // getFixtureDetail(id),
    hasFixtureStats(id),
    hasFixtureLineup(id),
    hasFixtureHeadToHead(id),
    hasFixtureTable(id),
    hasFixtureCommentaries(id),
  ]);

  return json({
    fixture,
    // fixtureDetail,
    hasStats,
    hasLineups,
    hasH2H,
    hasTable,
    hasCommentaries,
  });
};

export default function FixtureDetail() {
  const {
    fixture,
    // fixtureDetail,
    hasStats,
    hasLineups,
    hasH2H,
    hasTable,
    hasCommentaries,
  } = useLoaderData<typeof loader>();
  const tabs = [
    { value: "events", label: "Event", Icon: CalendarClock },
    ...(hasCommentaries
      ? [{ value: "commentary", label: "Commentary", Icon: MessageCircleMore }]
      : []),
    ...(hasH2H ? [{ value: "h2h", label: "H2H", Icon: Coins }] : []),
    ...(hasLineups
      ? [{ value: "lineups", label: "Lineups", Icon: Shirt }]
      : []),
    ...(hasStats ? [{ value: "stats", label: "Stats", Icon: BarChart }] : []),
    ...(hasTable ? [{ value: "table", label: "Table", Icon: Table }] : []),
  ];

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
                  // fixtureDetail={fixtureDetail}
                />
                <FixtureEventTeam team={fixture.awayTeam} />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="event">
            <TabsList className="w-full flex overflow-auto justify-normal">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1"
                >
                  <Link
                    prefetch="intent"
                    to={`./${tab.value}`}
                    className="px-3 py-1.5 flex gap-2 items-center"
                  >
                    <tab.Icon className="w-4" /> <span>{tab.label}</span>
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div>
            <Outlet />
          </div>
        </div>
      ) : (
        <div>
          <h3>Fixture not found</h3>
        </div>
      )}
    </div>
  );
}
