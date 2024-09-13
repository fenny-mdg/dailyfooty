import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { FixtureEventList } from "@/components/ui/fixture-detail.tsx";
import { getFixtureDetail } from "~/utils/fixture-detail.server.ts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  invariant(typeof id === "string", "Fixture id must be string");

  const fixtureDetail = await getFixtureDetail(id);

  return json({
    fixtureDetail,
  });
};

export default function Events() {
  const { fixtureDetail } = useLoaderData<typeof loader>();
  const firstPeriod = fixtureDetail?.events?.firstPeriod;
  const hasEvent = Object.keys(firstPeriod || {}).length > 0;
  const secondPeriod = fixtureDetail?.events?.secondPeriod;
  const overtime = fixtureDetail?.events?.overtime;

  return hasEvent ? (
    <>
      <FixtureEventList events={firstPeriod || {}} />
      <FixtureEventList events={secondPeriod || {}} />
      <FixtureEventList events={overtime || {}} />
    </>
  ) : null;
}
