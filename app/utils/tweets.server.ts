import { ObjectId } from "mongodb";

import db from "~/utils/db.server.ts";

type TweetFilter = {
  size?: number;
  page?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
};

export const getTweets = ({
  direction = "asc",
  page = 1,
  size = 10,
  sortBy = "tweetDate",
}: TweetFilter) => {
  const tweetCollection = db?.collection("tweets");

  return tweetCollection
    ?.find(
      {},
      {
        limit: size,
        sort: { [sortBy]: direction === "desc" ? -1 : 1 },
        skip: (page - 1) * size,
      },
    )
    .toArray();
};

export const countTweets = () => {
  const tweetCollection = db?.collection("tweets");

  return tweetCollection?.countDocuments();
};

export const getLatestTweets = async () => {
  const tweetCollection = db?.collection("tweets");

  return tweetCollection
    ?.find({ tweetImage: { $ne: null } }, { limit: 5, sort: { tweetDate: -1 } })
    .toArray();
};

export const getTweet = (id: string) => {
  const tweetCollection = db?.collection("tweets");

  return tweetCollection?.findOne({ _id: new ObjectId(id) });
};
