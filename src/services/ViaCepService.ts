import { ViaCepResponse } from '../interfaces/ViaCepResponse'
import fetch from 'node-fetch'

export default class ViaCepService {
  public async getAddressByZipCode(
    zipCode: string
  ): Promise<ViaCepResponse | null> {
    const response = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`)
    const data: any = await response.json()
    return data.erro ? null : data
  }
}
