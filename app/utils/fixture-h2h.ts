import { FixtureDTO } from "./fixture.ts";

type HeadToHeadFixture = {
  stage: {
    countryId: string;
    countryName: string;
    category: string;
    flagUrl: string;
    stageId: string;
    stageCode: string;
    stageName: string;
    flagAlt: string;
    isCup: boolean;
    isStageHidden: boolean;
  };
  events: {
    statusId: number;
    statusCode: string;
    startDateTimeString: string;
    winner: string;
    status: number;
    stage: {
      countryId: string;
      countryName: string;
      category: string;
      flagUrl: string;
      stageId: string;
      stageCode: string;
      stageName: string;
      flagAlt: string;
      isCup: boolean;
      isStageHidden: boolean;
    };
    homeName: string;
    homeScore: string;
    homeSlug: string;
    awayName: string;
    awayScore: string;
    awaySlug: string;
  }[];
};

export type HeadToHead = {
  h2h: HeadToHeadFixture[];
  home: HeadToHeadFixture[];
  away: HeadToHeadFixture[];
};

export type FixtureHeadToHeadDTO = {
  id: string;
  h2h: FixtureDTO[];
  home?: FixtureDTO[];
  away?: FixtureDTO[];
};
