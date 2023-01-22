export default class PhotoDTO {
  id: number
  url: string
  name: string

  constructor(id: number, url: string, name: string) {
    this.id = id
    this.url = url
    this.name = name
  }
}
