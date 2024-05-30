import db from "~/utils/db.server.ts";

const competitionCollectionName = "ls_competition";

type Competition = {
  _id: string;
  name: string;
  altName?: string;
  badgeUrl?: string;
  competitionId?: string;
  country?: string;
};

export const getCompetitions = () => {
  const competitionCollection = db?.collection<Competition>(
    competitionCollectionName,
  );

  return competitionCollection?.find({}).toArray();
};
