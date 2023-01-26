export default class EmailDTO {
  constructor(
    public readonly recipient: string,
    public readonly template: string
  ) {}
}
