import db from "~/utils/db.server.ts";

import { FixtureHeadToHeadDTO, HeadToHead } from "./fixture-h2h.ts";
import { CommonEvent, FixtureGeneric } from "./fixture.ts";

const fixtureH2hCollectionName = "ls_fixture_h2h";

type FixtureHeadToHeadEvent = CommonEvent & {
  headToHead: HeadToHead;
};
type FixtureHeadToHead = FixtureGeneric<FixtureHeadToHeadEvent>;

const formatFixtureHeadToHead = (
  fixtureHeadToHead: FixtureHeadToHead,
): FixtureHeadToHeadDTO => ({
  id: fixtureHeadToHead.id,
  // @ts-expect-error some internal type issue
  h2h: fixtureHeadToHead.pageProps.initialEventData?.event?.headToHead?.h2h
    ?.map((h) => {
      const { stage, events } = h;
      return events.map((event) => ({
        id: stage.stageId,
        competition: {
          id: stage.stageId,
          name: stage.stageName,
          tag: stage.stageCode,
          countryName: stage.countryName,
          countryTag: stage.countryId,
          countryAltName: stage.countryId,
        },
        startDate: Number(event.startDateTimeString),
        status: event.statusCode,
        score: [event.homeScore, event.awayScore],
        homeTeam: {
          id: event.homeName,
          img: event.homeSlug,
          name: event.homeName,
          abbreviation: event.homeName,
        },
        awayTeam: {
          id: event.awayName,
          img: event.awaySlug,
          name: event.awayName,
          abbreviation: event.awayName,
        },
        winner: event.winner?.toLowerCase(),
      }));
    })
    ?.flat(Infinity) || [],
});

export const getFixtureHeadToHead = async (id: FixtureHeadToHeadDTO["id"]) => {
  const fixtureHeadToHeadCollection = db?.collection<FixtureHeadToHead>(
    fixtureH2hCollectionName,
  );
  const fixtureHeadToHead = await fixtureHeadToHeadCollection?.findOne({
    id,
  });

  if (!fixtureHeadToHead) {
    return null;
  }

  return formatFixtureHeadToHead(fixtureHeadToHead);
};
