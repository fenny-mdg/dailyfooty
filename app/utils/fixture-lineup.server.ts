import db from "~/utils/db.server.ts";

import { FixtureLineupDTO, Lineups } from "./fixture-lineup.ts";
import { CommonEvent, FixtureGeneric } from "./fixture.ts";

const fixtureLineupsCollectionName = "ls_fixture_lineup";

type FixtureLineupEvent = CommonEvent & {
  lineups: Lineups;
  fieldData: {
    homeTeamName: string;
    awayTeamName: string;
    homeFormation: string;
    awayFormation: string;
    canRenderField: boolean;
  };
};
type FixtureLineups = FixtureGeneric<FixtureLineupEvent>;

const formatFixtureLineups = (
  fixtureLineups: FixtureLineups,
): FixtureLineupDTO => ({
  id: fixtureLineups.id,
  ...fixtureLineups.pageProps.initialEventData.event.lineups,
  homeFormation:
    fixtureLineups.pageProps.initialEventData.event.fieldData.homeFormation,
  awayFormation:
    fixtureLineups.pageProps.initialEventData.event.fieldData.awayFormation,
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
