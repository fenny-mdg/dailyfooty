import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  FixtureEventList,
  FixtureEventScore,
  FixtureEventTeam,
} from "@/components/ui/fixture-detail.tsx";
import { getFixtureDetail } from "~/utils/fixture-detail.server.ts";
import { getFixture } from "~/utils/fixture.server.ts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  invariant(typeof id === "string", "Fixture id must be string");

  const [fixture, fixtureDetail] = await Promise.all([
    getFixture(id),
    getFixtureDetail(id),
  ]);

  return json({ fixture, fixtureDetail });
};

export default function FixtureDetail() {
  const { fixture, fixtureDetail } = useLoaderData<typeof loader>();
  const firstPeriod = fixtureDetail?.events?.firstPeriod;
  const secondPeriod = fixtureDetail?.events?.secondPeriod;
  const overtime = fixtureDetail?.events?.overtime;

  return (
    <div className="w-full">
      {fixture ? (
        <Card>
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
            <FixtureEventList events={firstPeriod || {}} />
            <FixtureEventList events={secondPeriod || {}} />
            <FixtureEventList events={overtime || {}} />
          </CardContent>
        </Card>
      ) : (
        <div>
          <h3>Fixture not found</h3>
        </div>
      )}
    </div>
  );
}
