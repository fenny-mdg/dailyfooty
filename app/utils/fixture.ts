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
