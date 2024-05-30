import { json, Outlet, useLoaderData } from "@remix-run/react";

import { Container } from "@/components/ui/container.tsx";
import { getCompetitions } from "~/utils/competition.server.ts";

export const loader = async () => {
  const competitions = await getCompetitions();

  return json({ competitions });
};

export default function FixtureLayoutPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { competitions } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Outlet />
    </Container>
  );
}
