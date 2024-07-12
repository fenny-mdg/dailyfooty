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

export const alwaysShowStatKeys = ["yellowRedCards", "redCards", "yellowCards"];

export const statKeysMapper: {
  [key in keyof Statistics]: { default: string; icon?: unknown };
} = {
  shotsOnTarget: { default: "Shots on target" },
  shotsOffTarget: { default: "Shots off target" },
  shotsBlocked: { default: "Shots blocked" },
  possession: { default: "Possession" },
  corners: { default: "Corners" },
  offsides: { default: "Offsides" },
  fouls: { default: "Fouls" },
  throwIns: { default: "Throw-ins" },
  yellowCards: { default: "Yellow cards" },
  yellowRedCards: { default: "Yellow-red cards" },
  redCards: { default: "Red cards" },
  crosses: { default: "Crosses" },
  counterAttacks: { default: "Counter attacks" },
  goalkeeperSaves: { default: "Goalkeeper saves" },
  goalKicks: { default: "Goal kicks" },
  treatments: { default: "Treatments" },
};
