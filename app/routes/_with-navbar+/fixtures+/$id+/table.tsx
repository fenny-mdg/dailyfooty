import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table.tsx";
import { getFixtureTable } from "~/utils/fixture-table.server.ts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  invariant(typeof id === "string", "Fixture id must be string");

  const table = await getFixtureTable(id);

  return json({
    table,
  });
};

export default function TablePage() {
  const { table } = useLoaderData<typeof loader>();
  const allTable = table?.tables?.find((t) => t.kind === "all");

  return allTable ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Team</TableHead>
          <TableHead>P</TableHead>
          <TableHead>W</TableHead>
          <TableHead>D</TableHead>
          <TableHead>L</TableHead>
          <TableHead>F</TableHead>
          <TableHead>A</TableHead>
          <TableHead>GD</TableHead>
          <TableHead>PTS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allTable.teams.map((team) => (
          <TableRow key={team.id}>
            <TableCell>{team.rank}</TableCell>
            <TableCell>{team.name}</TableCell>
            <TableCell>{team.played}</TableCell>
            <TableCell>{team.wins}</TableCell>
            <TableCell>{team.draws}</TableCell>
            <TableCell>{team.losses}</TableCell>
            <TableCell>{team.goalsFor}</TableCell>
            <TableCell>{team.goalsAgainst}</TableCell>
            <TableCell>{team.goalsDiff}</TableCell>
            <TableCell>{team.points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : null;
}
