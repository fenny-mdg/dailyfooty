import { Link } from "@remix-run/react";

import { formatFixtureDate } from "~/utils/date-time.ts";
import { FixtureDTO } from "~/utils/fixture.ts";

import {
  FixtureCard,
  FixtureCardStatus,
  FixtureCardTeam,
  FixtureCardTeams,
} from "./fixture-card.tsx";

export const FixtureList = ({ fixtures }: { fixtures: FixtureDTO[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {fixtures.map((fixture) => (
        <>
          <FixtureCard key={fixture.id} className="relative">
            <Link
              prefetch="intent"
              to={`/fixtures/${fixture.id}`}
              className="absolute inset-0 w-full h-full z-10 cursor-pointer"
            />
            <FixtureCardStatus>
              {fixture.status === "NS"
                ? formatFixtureDate(fixture.startDate)
                : fixture.status}
            </FixtureCardStatus>
            <FixtureCardTeams>
              <FixtureCardTeam
                team={fixture.homeTeam}
                score={fixture.score[0]}
              />
              <FixtureCardTeam
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
