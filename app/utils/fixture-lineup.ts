import { Player } from "./player.ts";

export type Lineups = {
  homeStarters: Player[];
  awayStarters: Player[];
  homeSubs: Player[];
  awaySubs: Player[];
  homeCoach: Player[];
  awayCoach: Player[];
};

export type FixtureLineupDTO = { id: string } & Lineups;
