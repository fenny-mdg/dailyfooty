import db from "~/utils/db.server.ts";

import { FixtureLineupDTO, Lineups } from "./fixture-lineup.ts";
import { CommonEvent, FixtureGeneric } from "./fixture.ts";

const fixtureLineupsCollectionName = "ls_fixture_lineup";

type FixtureLineupEvent = CommonEvent & {
  lineups: Lineups;
};
type FixtureLineups = FixtureGeneric<FixtureLineupEvent>;

const formatFixtureLineups = (
  fixtureLineups: FixtureLineups,
): FixtureLineupDTO => ({
  id: fixtureLineups.id,
  ...fixtureLineups.pageProps.initialEventData.event.lineups,
});

export const getFixtureLineups = async (id: FixtureLineupDTO["id"]) => {
  const fixtureLineupsCollection = db?.collection<FixtureLineups>(
    fixtureLineupsCollectionName,
  );
  const fixtureLineups = await fixtureLineupsCollection?.findOne({
    id,
  });

  if (!fixtureLineups) {
    return null;
  }

  return formatFixtureLineups(fixtureLineups);
};
