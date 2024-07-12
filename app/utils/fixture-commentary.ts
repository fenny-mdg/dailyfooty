export type Commentary = {
  text: string;
  time: string;
  incident?: string;
};

export type FixtureCommentaryDTO = { id: string } & {
  commentaries: Commentary[];
};
