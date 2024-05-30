import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Card, CardContent } from "@/components/ui/card.tsx";
import { formatFixtureDate } from "~/utils/date-time.ts";
import { getFixture } from "~/utils/fixture.server.ts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  invariant(typeof id === "string", "Fixture id must be string");
  const fixture = await getFixture(id);

  return json({ fixture });
};

export default function FixtureDetail() {
  const { fixture } = useLoaderData<typeof loader>();

  return (
    <div className="w-full">
      {fixture ? (
        <Card>
          <CardContent className="flex w-full justify-between mt-6">
            <div className="flex flex-col gap-4 items-center">
              <img
                src={`/media/${fixture?.homeTeam.img}`}
                alt={fixture?.homeTeam.abbreviation}
                className="w-8"
              />
              <p className="text-sm md:text-base">{fixture?.homeTeam.name}</p>
            </div>
            <div className="justify-center flex flex-col items-center">
              {fixture?.score?.length ? (
                <div className="font-bold text-lg md:text-3xl">
                  {fixture?.score[0]} - {fixture?.score[1]}
                </div>
              ) : null}
              <p className="text-sm">
                {fixture.status === "NS"
                  ? formatFixtureDate(fixture.startDate)
                  : fixture.status}
              </p>{" "}
            </div>
            <div className="flex flex-col gap-4 items-center">
              <img
                src={`/media/${fixture?.awayTeam.img}`}
                alt={fixture?.awayTeam.abbreviation}
                className="w-8"
              />
              <p className="text-sm md:text-base">{fixture?.awayTeam.name}</p>
            </div>
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
