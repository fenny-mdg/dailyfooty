import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { FixtureList } from "@/components/ui/fixture-list.tsx";
import { getFixtureHeadToHead } from "~/utils/fixture-h2h.server.ts";
import { FixtureDTO } from "~/utils/fixture.ts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  invariant(typeof id === "string", "Fixture id must be string");

  const headToHead = await getFixtureHeadToHead(id);

  return json({
    headToHead,
  });
};

export default function H2H() {
  const { headToHead } = useLoaderData<typeof loader>();
  const fixtureGroupedByCompetitions = headToHead?.h2h?.reduce<
    Record<
      string,
      {
        order: number;
        competition: FixtureDTO["competition"];
        fixtures: FixtureDTO[];
      }
    >
  >((group, f, index) => {
    const { competition } = f;
    const { id: competitionId } = competition;

    if (!group[competitionId]) {
      group[competitionId] = { order: index, competition, fixtures: [] };
    }

    // @ts-expect-error Type issue
    group[competitionId].fixtures.push(f);

    return group;
  }, {});
  const competitionIds = Object.keys(fixtureGroupedByCompetitions || {});

  return fixtureGroupedByCompetitions ? (
    <>
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
    </>
  ) : null;
}
