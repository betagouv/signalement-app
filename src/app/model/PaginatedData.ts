export class PaginatedData<T> {
  totalCount: number;
  hasNextPage: boolean;
  entities: Array<T>;
}
