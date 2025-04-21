export interface ApiPaginationResponse<T> {
  data: T;
  meta: MetaResponse;
}

export interface MetaResponse {
  itemCount: number;
  order: string;
  page: number;
  pageCount: number;
  take: number;
}
