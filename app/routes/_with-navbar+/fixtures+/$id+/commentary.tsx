import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { Separator } from "@/components/ui/separator.tsx";
import { getFixtureCommentaries } from "~/utils/fixture-commentary.server.ts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  invariant(typeof id === "string", "Fixture id must be string");

  const commentaries = await getFixtureCommentaries(id);

  return json({
    commentaries: commentaries?.commentaries,
  });
};

export default function Commentary() {
  const { commentaries } = useLoaderData<typeof loader>();

  return (
    <div className="w-full flex flex-col">
      {commentaries?.map(({ time, text }) => (
        <>
          <div key={text} className="px-4 py-2 flex gap-4 text-xs md:text-base">
            <p className="w-14 text-center shrink-0">{time}</p> <p>{text}</p>
          </div>
          <Separator />
        </>
      ))}
    </div>
  );
}
