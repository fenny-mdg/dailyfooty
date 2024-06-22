type StagePhase = {
  className: string;
  label: string;
  pos?: number;
};

type Team = {
  id: string;
  name: string;
  draws: number;
  goalsAgainst: number;
  goalsDiff: number;
  goalsFor: number;
  hasMatchInProgress: boolean;
  losses: number;
  lossesOT: number;
  played: number;
  points: number;
  rank: number;
  reg: number;
  stagePhases: StagePhase[];
  teamBadge: { high: string; medium: string };
  wins: number;
  winsOT: number;
  pointsDeduction: string;
  slug: string;
};

type Table = {
  additionalInfo: { label: string; determined: string }[];
  country: string;
  countryName: string;
  hideLeagueTableBadges: boolean;
  isLimitedOversMatch: boolean;
  isSplit: boolean;
  kind: string;
  name: string;
  stagePhases: StagePhase;
  subName: string;
  teams: Team[];
  url: string;
};

export type Tables = {
  league: {
    "": Table[];
  };
};

export type FixtureTableDTO = {
  id: string;
} & { tables: Table[] };
