import { WithId } from "mongodb";

import db from "~/utils/db.server.ts";

import { toZeroUTC } from "./date-time.ts";
import { FixtureDTO, Stage } from "./fixture.ts";

interface Fixture extends Document {
  fixtureDate: Date;
  Stages: Stage[];
}

const fixtureCollectionName = "ls_fixture";

const formatFixtures = (fixtures?: WithId<Fixture>[]): FixtureDTO[] =>
  // @ts-expect-error flat map not really handled by TS
  fixtures
    ?.map((fixture) =>
      fixture.Stages.map((stage) =>
        stage.Events.map(({ Eid, Esd, Eps, Tr1, Tr2, T1, T2 }) => ({
          id: Eid,
          fixtureDate: fixture.fixtureDate,
          competition: {
            id: stage.Sid,
            name: stage.Snm,
            tag: stage.Scd,
            countryName: stage.Cnm,
            countryTag: stage.Ccd,
            countryAltName: stage.CnmT,
          },
          startDate: Esd,
          status: Eps,
          score: [Tr1, Tr2].filter(Boolean),
          homeTeam: {
            id: T1[0].ID,
            img: T1[0].Img,
            name: T1[0].Nm,
            abbreviation: T1[0].Abr,
          },
          awayTeam: {
            id: T2[0].ID,
            img: T2[0].Img,
            name: T2[0].Nm,
            abbreviation: T2[0].Abr,
          },
        })),
      ),
    )
    .flat(Infinity) || [];

export const countFixtures = () => {
  const fixtureCollection = db?.collection(fixtureCollectionName);

  return fixtureCollection?.countDocuments();
};

export const getUpcomingFixtures = async () => {
  const fixtureCollection = db?.collection<Fixture>(fixtureCollectionName);
  const today = toZeroUTC();

  try {
    const latestFixtures = await fixtureCollection
      ?.find(
        { fixtureDate: { $gte: today } },
        { limit: 1, sort: { fixtureDate: 1 } },
      )
      .toArray();

    const formattedFixtures = formatFixtures(latestFixtures);

    return formattedFixtures.filter(({ status }) => status === "NS");
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getLatestResults = async () => {
  const fixtureCollection = db?.collection<Fixture>(fixtureCollectionName);
  const today = toZeroUTC();

  try {
    const latestResults = await fixtureCollection
      ?.find(
        { fixtureDate: { $lt: today } },
        { limit: 1, sort: { fixtureDate: -1 } },
      )
      .toArray();

    return formatFixtures(latestResults);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getFixtures = async ({
  fixtureDate = new Date(),
}: {
  fixtureDate?: Date;
}) => {
  const fixtureCollection = db?.collection<Fixture>(fixtureCollectionName);
  const wantedDate = toZeroUTC(fixtureDate);

  try {
    const fixtures = await fixtureCollection
      ?.find(
        { fixtureDate: wantedDate },
        { limit: 1, sort: { fixtureDate: -1 } },
      )
      .toArray();

    return formatFixtures(fixtures);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getFixture = async (id: FixtureDTO["id"]) => {
  const fixtureCollection = db?.collection<Fixture>(fixtureCollectionName);
  const fixture = await fixtureCollection?.findOne({ "Stages.Events.Eid": id });

  if (!fixture) {
    return null;
  }

  const formattedFixture = formatFixtures([fixture]).find(
    ({ id: fixtureId }) => fixtureId === id,
  );

  return formattedFixture;
};
