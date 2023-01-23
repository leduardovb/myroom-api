import { FirebaseApp, initializeApp } from 'firebase/app'
import {
  FirebaseStorage,
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  listAll,
} from 'firebase/storage'
import BucketResponseDTO from '../dtos/BucketResponseDTO'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
}

export default class FirebaseService {
  private app!: FirebaseApp
  private storage!: FirebaseStorage

  constructor() {}

  init() {
    this.app = initializeApp(firebaseConfig)
    this.storage = getStorage(this.app)
    return this
  }

  async uploadToBucket(path: string, dataUrl: string) {
    console.debug(`Salvando uma nova imagem no bucket: ${path}`)
    const storageRef = this.getStorageRef(path)
    const snapshot = await uploadString(storageRef, dataUrl, 'data_url')
    console.debug(`Imagem salva com sucesso: ${path}`)
    const url = await this.getImageUrl(path, snapshot.ref.toString())
    return new BucketResponseDTO(snapshot, url)
  }

  private async getImageUrl(path: string, uri: string) {
    console.debug(`Buscando imagem url no bucket: ${path}`)
    const snapshot = ref(this.storage, uri)
    const imageUrl = await getDownloadURL(snapshot)
    console.debug(`Imagem url encontrada: ${path}`)
    return imageUrl
  }

  private getStorageRef(path: string) {
    return ref(this.storage, `${path}/`)
  }
}
