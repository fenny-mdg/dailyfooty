import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { XEmbed } from "react-social-media-embed";
import invariant from "tiny-invariant";

import { Card, CardTitle } from "@/components/ui/card.tsx";
import { getTweet } from "~/utils/tweets.server.ts";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { id } = params;

  invariant(typeof id === "string", "id must be a string");

  const tweet = await getTweet(id);

  return json({ tweet });
};

export default function ThreadDetail() {
  const { tweet } = useLoaderData<typeof loader>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { tweetText, tweetImage, link } = tweet as any;
  const [title, ...content] = tweetText.split("\n");

  return (
    <main className="relative min-h-screen flex py-8">
      <div className="flex w-full justify-center">
        <div className="w-full  lg:w-[80%] flex  max-lg:flex-col gap-8 ">
          <div className="flex flex-col gap-8 px-4 lg:p-0  break-words">
            <img src={tweetImage} alt="" />
            <h1 className="text-xl font-medium">{title}</h1>
            <p className="whitespace-pre-wrap">{content.join("\n")}</p>
            <div className="px-4 md:px-8 lg:px-24">
              <XEmbed url={link} />
            </div>
          </div>

          <div className="w-1/3 h-80 flex-shrink-0">
            <Card>
              <CardTitle>Related articles</CardTitle>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
