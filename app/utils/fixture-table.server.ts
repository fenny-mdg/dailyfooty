import db from "~/utils/db.server.ts";

import { FixtureTableDTO, Tables } from "./fixture-table.ts";
import { CommonEvent, FixtureGeneric } from "./fixture.ts";

const fixtureTableCollectionName = "ls_fixture_table";

type FixtureStatsEvent = CommonEvent & {
  tables: Tables;
};
type FixtureStats = FixtureGeneric<FixtureStatsEvent>;

const formatFixtureTable = (fixtureTable: FixtureStats): FixtureTableDTO => ({
  id: fixtureTable.id,
  tables: fixtureTable.pageProps.initialEventData?.event?.tables.league[""],
});

export const getFixtureTable = async (id: FixtureTableDTO["id"]) => {
  const fixtureTableCollection = db?.collection<FixtureStats>(
    fixtureTableCollectionName,
  );
  const fixtureTable = await fixtureTableCollection?.findOne({
    id,
  });

  if (!fixtureTable) {
    return null;
  }

  return formatFixtureTable(fixtureTable);
};
