import { WithId } from "mongodb";

import db from "~/utils/db.server.ts";

import { toZeroUTC } from "./date-time.ts";

type TeamEvent = {
  Nm: string;
  ID: string;
  Img: string;
  Abr: string;
};

type Event = {
  Eid: string;
  Pids: object;
  T1: TeamEvent[];
  T2: TeamEvent[];
  Eps: string;
  Esid: number;
  Epr: number;
  Ecov: number;
  Et: number;
  Esd: number;
  EO: number;
  EOX: number;
  Spid: number;
  Pid: number;
  Tr1?: string;
  Tr2?: string;
};

type Stage = {
  Sid: string;
  Snm: string;
  Scd: string;
  Cnm: string;
  CnmT: string;
  Csnm: string;
  Ccd: string;
  Scu: number;
  Events: Event[];
};

interface Fixture extends Document {
  fixtureDate: Date;
  Stages: Stage[];
}

export type FixtureDTO = {
  id: Event["Eid"];
  competition: {
    id: Stage["Sid"];
    name: Stage["Snm"];
    countryName: Stage["Cnm"];
    countryTag: Stage["CnmT"];
  };
  startDate: Event["Esd"];
  status: Event["Eps"];
  score: [Event["Tr1"], Event["Tr2"]];
  homeTeam: {
    id: TeamEvent["ID"];
    img: TeamEvent["Img"];
    name: TeamEvent["Nm"];
    abbreviation: TeamEvent["Abr"];
  };
  awayTeam: {
    id: TeamEvent["ID"];
    img: TeamEvent["Img"];
    name: TeamEvent["Nm"];
    abbreviation: TeamEvent["Abr"];
  };
};

const fixtureCollectionName = "ls_fixture";

const formatFixtures = (fixtures?: WithId<Fixture>[]): FixtureDTO[] =>
  // @ts-expect-error flat map not really handled by TS
  fixtures
    ?.map((fixture) =>
      fixture.Stages.map((stage) =>
        stage.Events.map(({ Eid, Esd, Eps, Tr1, Tr2, T1, T2 }) => ({
          id: Eid,
          competition: {
            id: stage.Sid,
            name: stage.Snm,
            countryName: stage.Cnm,
            countryTag: stage.CnmT,
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

    return formatFixtures(latestFixtures);
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
