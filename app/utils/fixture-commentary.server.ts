import db from "~/utils/db.server.ts";

import { Commentary, FixtureCommentaryDTO } from "./fixture-commentary.ts";
import { CommonEvent, FixtureGeneric } from "./fixture.ts";

const fixtureCommentariesCollectionName = "ls_fixture_commentary";

type FixtureLineupEvent = CommonEvent & {
  commentary: Commentary[];
};
type fixtureCommentaries = FixtureGeneric<FixtureLineupEvent>;

const formatFixtureCommentaries = (
  fixtureCommentaries: fixtureCommentaries,
): FixtureCommentaryDTO => ({
  id: fixtureCommentaries.id,
  commentaries: fixtureCommentaries.pageProps.initialEventData.event.commentary,
});

export const getFixtureCommentaries = async (
  id: FixtureCommentaryDTO["id"],
) => {
  const fixtureCommentariesCollection = db?.collection<fixtureCommentaries>(
    fixtureCommentariesCollectionName,
  );
  const fixtureCommentaries = await fixtureCommentariesCollection?.findOne({
    id,
  });

  if (!fixtureCommentaries) {
    return null;
  }

  return formatFixtureCommentaries(fixtureCommentaries);
};

export const hasFixtureCommentaries = async (id: FixtureCommentaryDTO["id"]) => {
  const fixtureCommentariesCollection = db?.collection<fixtureCommentaries>(
    fixtureCommentariesCollectionName,
  );
  const fixtureCommentaries = await fixtureCommentariesCollection?.findOne(
    {
      id,
    },
    { projection: { _id: 1 } },
  );

  return Boolean(fixtureCommentaries);
};
