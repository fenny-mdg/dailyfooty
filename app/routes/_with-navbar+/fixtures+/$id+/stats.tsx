import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Progress } from "@/components/ui/progress.tsx";
import { getFixtureStats } from "~/utils/fixture-stats.server.ts";
import {
  alwaysShowStatKeys,
  Statistics,
  statKeysMapper,
} from "~/utils/fixture-stats.ts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  invariant(typeof id === "string", "Fixture id must be string");

  const stats = await getFixtureStats(id);

  return json({
    stats,
  });
};

export default function Stats() {
  const { stats } = useLoaderData<typeof loader>();
  return stats ? (
    <div className="w-full p-8 flex flex-col gap-4">
      {Object.keys(stats).map((key) => {
        // @ts-expect-error stats can't be null if we are here
        const [home, away] = stats[key];
        const max = home + away;
        const homePercent = (home / max) * 100;
        const awayPercent = (away / max) * 100;

        return max || alwaysShowStatKeys.includes(key) ? (
          <div key={key} className="flex flex-col w-full">
            <div className="flex w-full">
              <p>{home}</p>
              <p className="flex-1 text-center">
                {statKeysMapper[key as keyof Statistics].default}
              </p>
              <p>{away}</p>
            </div>
            <div className="flex gap-4">
              <Progress value={homePercent} className="rotate-180 flex-1" />
              <Progress value={awayPercent} className="flex-1" />{" "}
            </div>
          </div>
        ) : null;
      })}
    </div>
  ) : null;
}
