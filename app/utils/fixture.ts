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

export type Stage = {
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

export type FixtureTeam = {
  id: TeamEvent["ID"];
  img: TeamEvent["Img"];
  name: TeamEvent["Nm"];
  abbreviation: TeamEvent["Abr"];
};

export type FixtureDTO = {
  fixtureDate?: Date;
  id: Event["Eid"];
  competition: {
    id: Stage["Sid"];
    name: Stage["Snm"];
    tag: Stage["Scd"];
    countryName: Stage["Cnm"];
    countryTag: Stage["Ccd"];
    countryAltName: Stage["CnmT"];
  };
  startDate: Event["Esd"];
  status: Event["Eps"];
  score: [Event["Tr1"], Event["Tr2"]];
  homeTeam: FixtureTeam;
  awayTeam: FixtureTeam;
};

export type CommonEvent = {
  status: string;
  categoryName: string;
  competitionId: string;
  countryId: string;
  finishDateTimeString: string;
  flagAlt: string;
  flagUrl: string;
  homeTeamScore: string;
  awayTeamScore: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamBadge: {
    high: string;
    medium: string;
  };
  awayTeamBadge: {
    high: string;
    medium: string;
  };
  isActive: boolean;
  isEventOutdated: boolean;
  isFinishedAfterPenalties: boolean;
  scores: {
    aggregateAwayScore?: string;
    aggregateHomeScore?: string;
    awayOvertimeScore: string;
    awayTeamName: string;
    awayTeamScore: string;
    homeOvertimeScore: string;
    homeTeamName: string;
    homeTeamScore: string;
    penaltyAwayScore: number;
    penaltyHomeScore: number;
  };
  stageId: string;
  stageName: string;
  winner: string;
  winnerId: string;
};

export type FixtureGeneric<T> = {
  id: string;
  pageProps: {
    __N_REDIRECT?: string;
    initialEventData: {
      isError: boolean;
      event: T;
    };
  };
};
