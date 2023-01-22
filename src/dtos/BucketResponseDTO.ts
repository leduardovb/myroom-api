import { UploadResult } from 'firebase/storage'

export default class BucketResponseDTO {
  snapshot: UploadResult
  url: string

  constructor(snapshot: UploadResult, url: string) {
    this.snapshot = snapshot
    this.url = url
  }
}
