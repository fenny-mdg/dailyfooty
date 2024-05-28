export type GenericFilter<T> = {
  size?: number;
  page?: number;
  orderBy?: keyof T;
  direction?: "asc" | "desc";
};
