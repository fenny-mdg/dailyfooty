import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  invariant(typeof id === "string", "Fixture id must be string");

  return redirect(`/fixtures/${id}/events`);
};
