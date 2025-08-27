import db from "~/utils/db.server.ts";

import { FixtureDetailDTO } from "./fixture-detail.ts";
import { FixtureStatsDTO, Statistics } from "./fixture-stats.ts";
import { CommonEvent, FixtureGeneric } from "./fixture.ts";

const fixtureStatsCollectionName = "ls_fixture_stats";

type FixtureStatsEvent = CommonEvent & {
  statistics: Statistics;
};
type FixtureStats = FixtureGeneric<FixtureStatsEvent>;

const formatFixtureStats = (fixtureStats: FixtureStats): FixtureStatsDTO => ({
  ...fixtureStats.pageProps.initialEventData.event.statistics,
});

export const getFixtureStats = async (id: FixtureDetailDTO["id"]) => {
  const fixtureStatsCollection = db?.collection<FixtureStats>(
    fixtureStatsCollectionName,
  );
  const fixtureStats = await fixtureStatsCollection?.findOne({
    id,
  });

  if (!fixtureStats) {
    return null;
  }

  return formatFixtureStats(fixtureStats);
};

export const hasFixtureStats = async (id: FixtureDetailDTO["id"]) => {
  const fixtureStatsCollection = db?.collection<FixtureStats>(
    fixtureStatsCollectionName,
  );
  const fixtureStats = await fixtureStatsCollection?.findOne(
    {
      id,
    },
    { projection: { _id: 1 } },
  );

  return Boolean(fixtureStats);
};
