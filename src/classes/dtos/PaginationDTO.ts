export default class PaginationDTO<T> {
  constructor(
    public data: Array<T>,
    public page: number,
    public limit: number,
    public count: number,
    public maxPages: number = Math.ceil(count / limit)
  ) {}
}
