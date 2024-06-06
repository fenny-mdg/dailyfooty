import { cn } from "@/lib/utils.ts";
import { formatFixtureDate } from "~/utils/date-time.ts";
import {
  FixtureDetailDTO,
  fixtureEventToIcon,
  FixtureEventValue,
  Incident,
} from "~/utils/fixture-detail.ts";
import { FixtureDTO, FixtureTeam } from "~/utils/fixture.ts";

type FixtureEventProps = { events: Incident[]; side?: "home" | "away" };

export const FixtureEventItem = ({
  events,
  side = "home",
}: FixtureEventProps) => {
  return (
    <div className={cn("flex-1 flex", { "justify-end": side === "home" })}>
      {events.map((event) => {
        const Icon = fixtureEventToIcon[event.type];

        return (
          <div
            key={event.id}
            className={cn("flex gap-2 items-center", {
              "flex-row-reverse": side === "away",
            })}
          >
            <div>
              <p
                className={cn({
                  "font-bold": [
                    "FootballGoal",
                    "FootballGoalPen",
                    "FootballOwnGoal",
                  ].includes(event.type),
                })}
              >
                {event.shortName}
              </p>{" "}
              <span>
                {event.assist?.map(({ shortName: shortNameAssist }) => (
                  <p key={shortNameAssist}>{shortNameAssist}</p>
                ))}
              </span>{" "}
            </div>
            {Icon ? <Icon /> : null}
          </div>
        );
      })}
    </div>
  );
};

type FixtureEventListProps = {
  events: FixtureEventValue;
};

export const FixtureEventList = ({ events }: FixtureEventListProps) => {
  return (
    <div className="flex flex-col gap-4 mt-8">
      {Object.keys(events).map((key) => (
        <div
          key={key}
          className="flex gap-4 md:gap-8 items-center text-xs md:text-sm border-b-[0.5px] pb-4"
        >
          {events[key].map(({ away, home }) => (
            <>
              <FixtureEventItem events={home} />
              <p className="w-6 md:w-12 text-center">
                {key}
                {"'"}
              </p>
              <FixtureEventItem events={away} side="away" />
            </>
          ))}
        </div>
      ))}
    </div>
  );
};

type FixtureEventTeamProps = { team: FixtureTeam };

export const FixtureEventTeam = ({ team }: FixtureEventTeamProps) => {
  return (
    <div className="flex flex-col gap-4 items-center w-20 text-center">
      <img src={`/media/${team.img}`} alt={team.abbreviation} className="w-8" />
      <p className="text-sm md:text-base">{team.name}</p>
    </div>
  );
};

type FixtureEventScoreProps = {
  fixture: FixtureDTO;
  fixtureDetail: FixtureDetailDTO | null;
};

export const FixtureEventScore = ({
  fixture,
  fixtureDetail,
}: FixtureEventScoreProps) => {
  const scores = fixtureDetail?.scores?.finalScore?.length
    ? fixtureDetail?.scores?.finalScore
    : fixture.score;

  return (
    <div className="justify-center flex flex-col items-center gap-2">
      {scores.length ? (
        <div className="font-bold text-lg md:text-3xl">
          {scores[0]} - {scores[1]}
        </div>
      ) : null}
      {fixtureDetail?.scores.aggregateScore?.length ? (
        <div className="text-xs md:text-base">
          agg. ({fixtureDetail?.scores.aggregateScore[0]} -{" "}
          {fixtureDetail?.scores.aggregateScore[1]})
        </div>
      ) : null}
      <p className="text-sm">
        {fixture.status === "NS"
          ? formatFixtureDate(fixture.startDate)
          : fixture.status}
      </p>{" "}
    </div>
  );
};
