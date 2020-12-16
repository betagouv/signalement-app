export interface PaginatedData<T> {
  totalCount: number;
  hasNextPage: boolean;
  entities: Array<T>;
}
