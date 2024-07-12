import { Link } from "@remix-run/react";

import { formatFixtureDate, formatFixtureTime } from "~/utils/date-time.ts";
import { FixtureDTO } from "~/utils/fixture.ts";

import {
  FixtureCard,
  FixtureCardStatus,
  FixtureCardTeam,
  FixtureCardTeams,
} from "./fixture-card.tsx";

type FixtureListProps = {
  fixtures: FixtureDTO[];
  disableLinks?: boolean;
};

export const FixtureList = ({
  fixtures,
  disableLinks = false,
}: FixtureListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {fixtures.map((fixture) => (
        <>
          <FixtureCard key={fixture.id} className="relative">
            {disableLinks ? null : (
              <Link
                prefetch="intent"
                to={`/fixtures/${fixture.id}`}
                className="absolute inset-0 w-full h-full z-10 cursor-pointer"
              />
            )}
            <FixtureCardStatus>
              {fixture.status === "NS" ? (
                <div className="flex flex-col items-center gap-2">
                  <p>{formatFixtureTime(fixture.startDate)}</p>
                  <p>{formatFixtureDate(fixture.startDate)}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <p> {fixture.status}</p>
                  <p>{formatFixtureDate(fixture.startDate)}</p>
                </div>
              )}
            </FixtureCardStatus>
            <FixtureCardTeams>
              <FixtureCardTeam
                winner={fixture.winner === "home"}
                team={fixture.homeTeam}
                score={fixture.score[0]}
              />
              <FixtureCardTeam
                winner={fixture.winner === "away"}
                team={fixture.awayTeam}
                score={fixture.score[1]}
              />
            </FixtureCardTeams>
          </FixtureCard>
        </>
      ))}
    </div>
  );
};
