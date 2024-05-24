import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel.tsx";
import DataCardList from "@/components/ui/data-card-list.tsx";
import { getRelativeDateFromNow } from "~/utils/date-time.ts";
import {
  countTweets,
  getLatestTweets,
  getTweets,
} from "~/utils/tweets.server.ts";

export const meta: MetaFunction = () => [{ title: "Daily footy" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get("page") ?? "1");
  const size = parseInt(searchParams.get("size") ?? "10");
  const [tweets, total, latestTweets] = await Promise.all([
    getTweets({ direction: "desc", sortBy: "tweetDate", page, size }),
    countTweets(),
    getLatestTweets(),
  ]);

  return json({ tweets, total, page, size, latestTweets });
};

export default function Index() {
  const { tweets, total, page, size, latestTweets } =
    useLoaderData<typeof loader>();
  const columns: ColumnDef<
    { tweetImage: string; tweetDate: string; tweetText: string }[]
  >[] = [
    {
      accessorFn: (row) => {
        return row;
      },
      cell: (props) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tweet = props.getValue() as any;
        const { tweetImage, tweetText, tweetDate, createdAt } = tweet;
        console.log(tweetDate, typeof createdAt);
        const [title] = tweetText.split("\n").filter(Boolean);
        return (
          <Card className="group w-full group">
            <CardContent className="flex gap-4 pt-8 max-lg:flex-col relative">
              <Link
                to={`/thread/${tweet._id}`}
                className="absolute inset-0 w-full h-full z-10 cursor-pointer"
              />
              <div className="w-full h-48 lg:w-52 lg:h-32 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={tweetImage}
                  alt="tweet"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col justify-between">
                <h3 className="text-lg font-medium mb-4">{title}</h3>
                <p className="text-sm text-gray-500">
                  {getRelativeDateFromNow(tweetDate || createdAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      },
      id: "logs",
    },
  ];

  return (
    <div>
      <Carousel
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent>
          {latestTweets?.map((tweet) => (
            <CarouselItem
              key={tweet._id}
              className="relative flex justify-center"
            >
              <Link
                to={`/thread/${tweet._id}`}
                className="absolute inset-0 w-full h-full z-10 cursor-pointer"
              />
              <div className="relative w-fit">
                <img
                  src={tweet.tweetImage}
                  alt="tweet"
                  className="w-full h-[600px] flex-shrink-0 flex-grow-0 object-cover lg:object-contain"
                />
                <h3 className="absolute bottom-5 text-xl text-white self-center left-0 right-0 mx-4 md:mx-10 md:text-2xl lg:text-3xl z-20 text-center">
                  {tweet.tweetText}
                </h3>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center pb-8"></div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <main className="relative min-h-screen flex py-8">
        <div className="flex w-full justify-center">
          <div className="w-full  lg:w-[80%] flex  flex-col lg:flex-row gap-8">
            <div className="flex lg:w-2/3">
              <div className="w-full">
                <DataCardList
                  paginationOptions={{ pageIndex: page, pageSize: size }}
                  // @ts-expect-error - I'm not sure what the correct type is here
                  data={tweets}
                  columns={columns}
                  totalCount={total}
                  className="gap-4 flex flex-col w-full"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/3 h-96 flex flex-col gap-8">
              <Card>
                <CardHeader className="uppercase font-medium">
                  Upcoming matches
                </CardHeader>
                <CardContent className="h-48"></CardContent>
              </Card>
              <Card>
                <CardHeader className="uppercase font-medium">
                  Match results
                </CardHeader>
                <CardContent className="h-48"></CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
