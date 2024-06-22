type Stat = [number, number];

export type Statistics = {
  shotsOnTarget: Stat;
  shotsOffTarget: Stat;
  shotsBlocked: Stat;
  possession: Stat;
  corners: Stat;
  offsides: Stat;
  fouls: Stat;
  throwIns: Stat;
  yellowCards: Stat;
  yellowRedCards: Stat;
  redCards: Stat;
  crosses: Stat;
  counterAttacks: Stat;
  goalkeeperSaves: Stat;
  goalKicks: Stat;
  treatments: Stat;
};

export type FixtureStatsDTO = Statistics;
