import { json, LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";

import { hasFixtureCommentaries } from "~/utils/fixture-commentary.server.ts";
import { getFixtureDetail } from "~/utils/fixture-detail.server.ts";
import { hasFixtureHeadToHead } from "~/utils/fixture-h2h.server.ts";
import { hasFixtureLineup } from "~/utils/fixture-lineup.server.ts";
import { hasFixtureStats } from "~/utils/fixture-stats.server.ts";
import { hasFixtureTable } from "~/utils/fixture-table.server.ts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  invariant(typeof id === "string", "Fixture id must be string");

  const [
    fixtureDetail,
    hasStats,
    hasLineups,
    hasH2H,
    hasTable,
    hasCommentaries,
  ] = await Promise.all([
    getFixtureDetail(id),
    hasFixtureStats(id),
    hasFixtureLineup(id),
    hasFixtureHeadToHead(id),
    hasFixtureTable(id),
    hasFixtureCommentaries(id),
  ]);

  return json({
    fixtureDetail,
    hasStats,
    hasLineups,
    hasH2H,
    hasTable,
    hasCommentaries,
  });
};
