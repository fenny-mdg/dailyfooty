import { FunctionComponent } from "react";

import { GoalIcon } from "~/components/football-icons/goal.tsx";
import { NoGoalAfterVARIcon } from "~/components/football-icons/no-goal-after-var.tsx";
import { OwnGoalIcon } from "~/components/football-icons/own-goal.tsx";
import { PenaltyGoalIcon } from "~/components/football-icons/penalty-goal-ok.tsx";
import { PenaltyMissedIcon } from "~/components/football-icons/penalty-missed.tsx";
import { RedCardIcon } from "~/components/football-icons/red-card.tsx";
import { YellowCardIcon } from "~/components/football-icons/yellow-card.tsx";

export type Team = {
  id: string;
  name: string;
  img: string;
};

export type Score = {
  finalScore: [string, string] | null;
  overtimeScore: [string, string] | null;
  penaltyScore: [number, number];
  aggregateScore: [string, string] | null;
};

type FixtureEventKey = "firstPeriod" | "secondPeriod" | "overtime";

export type FixtureEventValue = Record<
  string,
  { away: Incident[]; home: Incident[] }[]
>;

export type FixtureEvent = {
  [key in FixtureEventKey]: FixtureEventValue;
};

export type FixtureDetailDTO = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  scores: Score;
  events: FixtureEvent;
  status: string;
};

export type Incident = {
  name: string;
  shortName: string;
  time: string;
  id: string;
  score: {
    home: string;
    away: string;
  };
  type: string;
  assist?: {
    name: string;
    shortName: string;
  }[];
};

export const fixtureEventToIcon: Record<string, FunctionComponent> = {
  FootballGoal: GoalIcon,
  FootballGoalPen: PenaltyGoalIcon,
  FootballGoalPenMiss: PenaltyMissedIcon,
  FootballYellowCard: YellowCardIcon,
  // FootballRedYellowCard:
  FootballOwnGoal: OwnGoalIcon,
  FootballRedCard: RedCardIcon,
  FootballGoalMiss: NoGoalAfterVARIcon,
};
